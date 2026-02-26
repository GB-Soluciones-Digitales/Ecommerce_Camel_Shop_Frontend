export const initialOrderState = {
  nombreCliente: '',
  telefono: '',
  direccionEnvio: '',
  metodoPago: 'Efectivo',
  items: [],
  tempItem: { productoId: '', color: '', talle: '', cantidad: 1 }
};

export function orderReducer(state, action) {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value };
    case 'SET_TEMP_ITEM':
      return { ...state, tempItem: { ...state.tempItem, ...action.payload } };
    case 'ADD_ITEM':
      return { 
        ...state, 
        items: [...state.items, action.item],
        tempItem: { ...state.tempItem, color: '', talle: '', cantidad: 1 } 
      };
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter((_, i) => i !== action.index) };
    case 'RESET':
      return initialOrderState;
    default:
      return state;
  }
}