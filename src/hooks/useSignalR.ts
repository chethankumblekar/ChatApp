import { useEffect, useRef } from 'react';
import * as signalR from '@microsoft/signalr';
import { HubEvents, HUB_URL } from '../config';
import { getToken } from '../utils/token';
import { useAppDispatch } from './useAppDispatch';
import {
  appendMessage, markRead,
  setOnlineUsers, setUserOnline, setUserOffline,
  setConnectionStatus,
} from '../store/slices/chatSlice';
import type { SignalRMessage } from '../types';

let _connection: signalR.HubConnection | null = null;

export function getHubConnection(): signalR.HubConnection | null {
  return _connection;
}

export async function startHub(): Promise<void> {
  if (_connection) return;
  _connection = new signalR.HubConnectionBuilder()
    .withUrl(HUB_URL, {
      accessTokenFactory: getToken,
    })
    .withAutomaticReconnect([0, 2_000, 5_000, 10_000, 30_000])
    .configureLogging(process.env.NODE_ENV === 'development' ? signalR.LogLevel.Information : signalR.LogLevel.Warning)
    .build();

  await _connection.start();
}

export async function stopHub(): Promise<void> {
  await _connection?.stop();
  _connection = null;
}

export function useSignalRListeners() {
  const dispatch = useAppDispatch();
  const registered = useRef(false);

  useEffect(() => {
    const h = _connection;
    if (!h || registered.current) return;
    registered.current = true;

    h.onreconnecting(() => dispatch(setConnectionStatus('Reconnecting')));
    h.onreconnected(()  => dispatch(setConnectionStatus('Connected')));
    h.onclose(()        => dispatch(setConnectionStatus('Disconnected')));
    dispatch(setConnectionStatus(h.state === signalR.HubConnectionState.Connected ? 'Connected' : 'Connecting'));

    // Presence
    h.on(HubEvents.ONLINE_USERS, (ids: string[]) => dispatch(setOnlineUsers(ids)));
    h.on(HubEvents.USER_ONLINE,  (id: string)    => dispatch(setUserOnline(id)));
    h.on(HubEvents.USER_OFFLINE, (id: string)    => dispatch(setUserOffline(id)));

    // Messages
    h.on(HubEvents.RECEIVE_MESSAGE, (msg: SignalRMessage) => dispatch(appendMessage(msg)));
    h.on(HubEvents.MESSAGE_SENT,    (msg: SignalRMessage) => dispatch(appendMessage(msg)));

    // Read receipts
    h.on(HubEvents.MESSAGE_READ, (messageId: string) => dispatch(markRead(messageId)));

    return () => {
    };
  }, [dispatch]);
}
