import type {Reducer, Effect} from 'umi'

export type GlobalSocketModalType = {
  namespace: 'globalSocket'
  state: ModelTypes.GlobalSocketState
  effects: {
    mackConnection: Effect
    sendMessage: Effect
    tellDisconnectSocket: Effect
  }
  reducers: {
    connectedSocket: Reducer
    getSocketMessage: Reducer
    disconnectSocket: Reducer
  }
}

const GlobalSocket: GlobalSocketModalType = {
  namespace: 'globalSocket',
  state: {
    curSocket: undefined,
    data: undefined
  },
  effects: {
    *mackConnection({payload}, {put}) {
      yield put({
        type: 'connectedSocket',
        payload
      })
    },
    *tellDisconnectSocket(_, {put}) {
      yield put({
        type: 'disconnectSocket'
      })
    },
    *sendMessage({payload}, {put}) {
      yield put({
        type: 'getSocketMessage',
        payload: {
          data: payload
        }
      })
    }
  },

  reducers: {
    connectedSocket: (state, {payload}) => {
      state?.curSocket?.close()
      return {
        ...state,
        curSocket: payload
      }
    },
    disconnectSocket: (state) => {
      return {
        ...state,
        curSocket: null
      }
    },
    getSocketMessage: (state, {payload}) => {
      return {
        ...state,
        data: JSON.parse(payload.data)
      }
    }
  }
}

export default GlobalSocket
