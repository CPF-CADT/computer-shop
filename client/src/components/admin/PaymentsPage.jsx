import React, { useState } from 'react';
import { MdPayment, MdSearch, MdFilterList, MdRefresh, MdDownload, MdCheckCircle, MdError, MdAccessTime } from 'react-icons/md';

export default function PaymentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Mock payment data
  const payments = [
    {
      id: 'PAY-001',
      orderId: 'ORD-001',
      customer: 'John Doe',
      amount: 299.99,
      status: 'completed',
      method: 'PayPal',
      transactionId: 'PP123456789',
      date: '2025-07-15T10:30:00',
      fee: 8.99,
      net: 291.00
    },
    {
      id: 'PAY-002',
      orderId: 'ORD-002',
      customer: 'Jane Smith',
      amount: 1299.99,
      status: 'completed',
      method: 'Stripe',
      transactionId: 'ST987654321',
      date: '2025-07-15T09:15:00',
      fee: 37.70,
      net: 1262.29
    },
    {
      id: 'PAY-003',
      orderId: 'ORD-003',
      customer: 'Mike Johnson',
      amount: 599.99,
      status: 'pending',
      method: 'ABA Bank',
      transactionId: 'ABA456789123',
      date: '2025-07-15T08:45:00',
      fee: 5.00,
      net: 594.99
    },
    {
      id: 'PAY-004',
      orderId: 'ORD-004',
      customer: 'Sarah Wilson',
      amount: 899.99,
      status: 'failed',
      method: 'Wing',
      transactionId: 'WG789123456',
      date: '2025-07-14T16:20:00',
      fee: 0,
      net: 0
    },
    {
      id: 'PAY-005',
      orderId: 'ORD-005',
      customer: 'David Brown',
      amount: 199.99,
      status: 'refunded',
      method: 'PayPal',
      transactionId: 'PP555666777',
      date: '2025-07-14T14:10:00',
      fee: -5.99,
      net: 0
    },
    {
      id: 'PAY-006',
      orderId: 'ORD-005',
      customer: 'David Brown',
      amount: 199.99,
      status: 'refunded',
      method: 'PayPal',
      transactionId: 'PP555666777',
      date: '2025-07-14T14:10:00',
      fee: -5.99,
      net: 0
    },
    {
      id: 'PAY-007',
      orderId: 'ORD-005',
      customer: 'David Brown',
      amount: 199.99,
      status: 'refunded',
      method: 'PayPal',
      transactionId: 'PP555666777',
      date: '2025-07-14T14:10:00',
      fee: -5.99,
      net: 0
    }
  ];

  const integrationLogs = [
    {
      id: 1,
      service: 'PayPal',
      status: 'connected',
      lastSync: '2025-07-15T11:00:00',
      transactionsToday: 15,
      revenue: 4567.89
    },
    {
      id: 2,
      service: 'Stripe',
      status: 'connected',
      lastSync: '2025-07-15T10:45:00',
      transactionsToday: 23,
      revenue: 7890.12
    },
    {
      id: 3,
      service: 'ABA Bank',
      status: 'connected',
      lastSync: '2025-07-15T10:30:00',
      transactionsToday: 8,
      revenue: 2345.67
    },
    {
      id: 4,
      service: 'Wing',
      status: 'error',
      lastSync: '2025-07-15T09:00:00',
      transactionsToday: 0,
      revenue: 0
    }
  ];

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPayments = filteredPayments.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const totalRevenue = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.net, 0);

  const pendingAmount = payments
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);

  const handleRefund = (paymentId, amount) => {
    // Handle refund logic here
    console.log(`Refunding ${amount} for payment ${paymentId}`);
    setShowRefundModal(false);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <MdCheckCircle className="text-green-500" />;
      case 'pending':
        return <MdAccessTime className="text-yellow-500" />;
      case 'failed':
        return <MdError className="text-red-500" />;
      case 'refunded':
        return <MdRefresh className="text-blue-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Payments & Transactions</h1>
          <p className="mt-2 text-gray-600">Monitor payments and manage refunds</p>
        </div>
        <div className="flex items-center gap-4 mt-4 lg:mt-0">
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2">
            <MdDownload />
            Export
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <MdRefresh />
            Sync All
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-3xl font-bold text-green-600">${totalRevenue.toLocaleString()}</p>
              <p className="text-sm text-gray-500">Net amount received</p>
            </div>
            <MdPayment className="text-3xl text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Payments</p>
              <p className="text-3xl font-bold text-yellow-600">${pendingAmount.toLocaleString()}</p>
              <p className="text-sm text-gray-500">Awaiting confirmation</p>
            </div>
            <MdAccessTime className="text-3xl text-yellow-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed Today</p>
              <p className="text-3xl font-bold text-blue-600">{payments.filter(p => p.status === 'completed' && new Date(p.date).toDateString() === new Date().toDateString()).length}</p>
              <p className="text-sm text-gray-500">Successful transactions</p>
            </div>
            <MdCheckCircle className="text-3xl text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Failed Payments</p>
              <p className="text-3xl font-bold text-red-600">{payments.filter(p => p.status === 'failed').length}</p>
              <p className="text-sm text-gray-500">Require attention</p>
            </div>
            <MdError className="text-3xl text-red-600" />
          </div>
        </div>
      </div>

      {/* Integration Status */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Payment Gateway Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {integrationLogs.map((integration) => (
            <div key={integration.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-900">{integration.service}</h3>
                <span className={`w-3 h-3 rounded-full ${integration.status === 'connected' ? 'bg-green-500' : 'bg-red-500'}`}></span>
              </div>
              <div className="space-y-1 text-sm text-gray-600">
                <p>Status: <span className={integration.status === 'connected' ? 'text-green-600' : 'text-red-600'}>{integration.status}</span></p>
                <p>Today: {integration.transactionsToday} transactions</p>
                <p>Revenue: ${integration.revenue.toLocaleString()}</p>
                <p className="text-xs">Last sync: {new Date(integration.lastSync).toLocaleTimeString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by customer, order ID, or transaction ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <MdFilterList className="text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{payment.id}</div>
                      <div className="text-sm text-gray-500">Order: {payment.orderId}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{payment.customer}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">${payment.amount}</div>
                    <div className="text-sm text-gray-500">Fee: ${payment.fee}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{payment.method}</div>
                    <div className="text-sm text-gray-500">{payment.transactionId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(payment.status)}
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                        {payment.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(payment.date).toLocaleDateString()}
                    <br />
                    {new Date(payment.date).toLocaleTimeString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      {payment.status === 'completed' && (
                        <button
                          onClick={() => {
                            setSelectedTransaction(payment);
                            setShowRefundModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Refund
                        </button>
                      )}
                      {payment.status === 'failed' && (
                        <button className="text-green-600 hover:text-green-900">
                          Retry
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div
            className="overflow-y-auto"
            style={{ maxHeight: '425px' }} // Show ~5 rows, only vertical scroll
          >
            {/* ...existing code for scrollable content if needed... */}
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                PAGE {currentPage} OF {totalPages}
              </div>
              <div className="flex items-center space-x-2">
                {/* First Page */}
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded ${
                    currentPage === 1
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border'
                  }`}
                >
                  1
                </button>

                {/* Previous Pages */}
                {currentPage > 3 && (
                  <>
                    <span className="text-gray-500">...</span>
                  </>
                )}

                {/* Current Page Range */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const firstPage = Math.max(1, Math.min(totalPages - 4, currentPage - 2));
                  const page = firstPage + i;
                  if (page < 1 || page > totalPages) return null;
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1 rounded ${
                        currentPage === page
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-100 border'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}

                {/* Next Pages */}
                {currentPage < totalPages - 2 && (
                  <>
                    <span className="text-gray-500">...</span>
                  </>
                )}

                {/* Last Page */}
                {totalPages > 1 && (
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded ${
                      currentPage === totalPages
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border'
                    }`}
                  >
                    {totalPages}
                  </button>
                )}

                {/* Next Button */}
                <button
                  onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded ${
                    currentPage === totalPages
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border'
                  }`}
                >
                  »
                </button>

                {/* Last Button */}
                <button
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded ${
                    currentPage === totalPages
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border'
                  }`}
                >
                  LAST »
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Refund Modal */}
      {showRefundModal && selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Process Refund</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Payment ID: {selectedTransaction.id}</p>
                <p className="text-sm text-gray-600">Customer: {selectedTransaction.customer}</p>
                <p className="text-sm text-gray-600">Original Amount: ${selectedTransaction.amount}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Refund Amount
                </label>
                <input
                  type="number"
                  max={selectedTransaction.amount}
                  defaultValue={selectedTransaction.amount}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Refund
                </label>
                <textarea
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter reason for refund..."
                ></textarea>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowRefundModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRefund(selectedTransaction.id, selectedTransaction.amount)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Process Refund
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

