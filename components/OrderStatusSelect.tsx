
import React, { useState } from 'react';
import { Order, OrderStatus } from '../types';
import { api } from '../services/api';
import { Loader2 } from 'lucide-react';

interface OrderStatusSelectProps {
  order: Order;
  onUpdate?: (updatedOrder: Order) => void;
}

export default function OrderStatusSelect({ order, onUpdate }: OrderStatusSelectProps) {
  const [status, setStatus] = useState<OrderStatus>(order.status);
  const [loading, setLoading] = useState(false);

  async function handleChange(newStatus: OrderStatus) {
    if (loading || newStatus === status) return;

    // Optimistic UI update
    const previousStatus = status;
    setStatus(newStatus);
    setLoading(true);

    try {
      const updatedOrder = await api.admin.updateOrderStatus(order.id, newStatus);
      if (onUpdate) onUpdate(updatedOrder);
    } catch (err) {
      alert("Erro ao atualizar logística");
      setStatus(previousStatus); // Revert on error
    } finally {
      setLoading(false);
    }
  }

  const getStatusClasses = (s: OrderStatus) => {
    switch (s) {
      case 'DELIVERED':
        return "bg-green-200 text-green-800 border-green-300";
      case 'SHIPPED':
        return "bg-purple-200 text-purple-800 border-purple-300";
      case 'PAID':
        return "bg-yellow-200 text-yellow-800 border-yellow-300";
      default: // PENDING
        return "bg-blue-200 text-blue-800 border-blue-300";
    }
  };

  return (
    <div className="relative flex items-center w-full max-w-[140px]">
      <select
        value={status}
        onChange={(e) => handleChange(e.target.value as OrderStatus)}
        disabled={loading}
        className={`
          w-full py-2 pl-3 pr-8 rounded-md text-xs font-bold uppercase cursor-pointer
          outline-none border transition-colors appearance-none hover:opacity-90
          ${getStatusClasses(status)}
          ${loading ? 'opacity-70 cursor-not-allowed' : ''}
        `}
      >
        <option value="PENDING">Pendente</option>
        <option value="PAID">Pago</option>
        <option value="SHIPPED">Enviado</option>
        <option value="DELIVERED">Entregue</option>
      </select>

      <div className="absolute right-2 pointer-events-none flex items-center justify-center opacity-70">
        {loading ? (
            <Loader2 size={12} className="animate-spin text-inherit" />
        ) : (
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                d="M1 1L5 5L9 1"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                />
            </svg>
        )}
      </div>
    </div>
  );
}
