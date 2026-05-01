"use client";
import React from 'react';
import { Package, Truck, CheckCircle, Clock } from 'lucide-react';

export default function BuyerOrdersPage() {
    const orders = [
        { id: '#ORD-7721', farmer: 'Rajinder Singh', item: 'Rice Straw', qty: '12 Tons', price: '₹26,400', date: 'Jan 26, 2026', status: 'In Transit', icon: Truck, color: 'text-orange-600 bg-orange-100' },
        { id: '#ORD-7720', farmer: 'Harpreet Kaur', item: 'Wheat Stubble', qty: '5 Tons', price: '₹22,500', date: 'Jan 24, 2026', status: 'Delivered', icon: CheckCircle, color: 'text-green-600 bg-green-100' },
        { id: '#ORD-7718', farmer: 'Amit Kumar', item: 'Sugarcane Trash', qty: '8 Tons', price: '₹25,600', date: 'Jan 20, 2026', status: 'Processing', icon: Clock, color: 'text-blue-600 bg-blue-100' },
    ];

    const handleDownloadReport = () => {
        const headers = ['Order ID', 'Farmer', 'Item', 'Quantity', 'Price', 'Date', 'Status'];
        const csvRows = [
            headers.join(','),
            ...orders.map(o => `${o.id},${o.farmer},${o.item},${o.qty},${o.price.replace('₹', '')},${o.date},${o.status}`)
        ];

        const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `StubbleX_Order_Report_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    };

    return (
        <div className="max-w-6xl mx-auto py-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-earth-900">My Orders</h1>
                    <p className="text-earth-600">Track raw material shipments and payments.</p>
                </div>
                <button
                    onClick={handleDownloadReport}
                    className="px-4 py-2 bg-earth-800 text-white rounded-lg hover:bg-earth-900 transition-colors font-medium shadow-md shadow-earth-800/20"
                >
                    Download Report
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-earth-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-earth-50 text-earth-600 font-medium border-b border-earth-100">
                        <tr>
                            <th className="p-4 pl-6">Order ID</th>
                            <th className="p-4">Farmer / Source</th>
                            <th className="p-4">Biomass Type</th>
                            <th className="p-4">Quantity</th>
                            <th className="p-4">Total Cost</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-earth-50">
                        {orders.map((order) => (
                            <tr key={order.id} className="hover:bg-earth-50/50 transition-colors">
                                <td className="p-4 pl-6 font-mono text-earth-900 font-medium">{order.id}</td>
                                <td className="p-4 text-earth-700">
                                    <div className="font-medium">{order.farmer}</div>
                                    <div className="text-xs text-earth-400">{order.date}</div>
                                </td>
                                <td className="p-4 text-earth-700">{order.item}</td>
                                <td className="p-4 font-semibold text-earth-900">{order.qty}</td>
                                <td className="p-4 text-earth-700">{order.price}</td>
                                <td className="p-4">
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${order.color}`}>
                                        <order.icon size={14} /> {order.status}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <button className="text-sm text-earth-600 hover:text-earth-900 font-medium underline">View Details</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
