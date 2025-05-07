<template>
  <div class="card">
    <div class="card-header">
      <h5 class="title">Quản Lý Đơn Hàng</h5>
    </div>
    <div class="card-body">
      <div class="tab-container">
        <div class="tabs">
          <div 
            v-for="tab in tabs" 
            :key="tab.id"
            :class="['tab', { active: currentTab === tab.id }]"
            @click="currentTab = tab.id"
          >
            {{ tab.name }} <span v-if="filteredOrders(tab.id).length > 0">({{ filteredOrders(tab.id).length }})</span>
          </div>
        </div>
        
        <div class="tab-content">
          <template v-if="filteredOrders(currentTab).length > 0">
            <ul class="order-list">
              <li v-for="order in filteredOrders(currentTab)" :key="order.id" class="order-item">
                <div class="order-info">
                  <div class="order-id">Đơn hàng #{{ order.id }}</div>
                  <div class="order-customer">{{ order.customer }}</div>
                  <div class="order-date">Ngày đặt: {{ formatDate(order.orderDate) }}</div>
                  <div class="order-address">Địa chỉ: {{ order.address }}</div>
                </div>
                <div class="order-info-status" v-if="currentTab === 'all'">
                  <div class="status-badge" :class="getStatusClass(order.status)">
                    {{ getStatusText(order.status) }}
                  </div>
                </div>
                <div class="order-actions">
                  <button class="btn btn-detail" @click="openOrderDetail(order)">Chi tiết</button>
                  <button v-if="canMoveNext(order) && currentTab !== 'all'" class="btn btn-next" @click="moveToNextStatus(order)">
                    {{ getNextActionText(order) }}
                  </button>
                </div>
              </li>
            </ul>
          </template>
          <template v-else>
            <div class="empty-state">
              <i class="fas fa-box-open"></i>
              <p>Không có đơn hàng nào trong danh sách này</p>
            </div>
          </template>
        </div>
      </div>
    </div>
    
    <!-- Modal Chi tiết đơn hàng -->
    <div v-if="showOrderDetail" class="modal-overlay" @click.self="closeOrderDetail">
      <div class="modal-container">
        <div class="modal-header">
          <h3>Chi tiết đơn hàng #{{ selectedOrder.id }}</h3>
          <button class="close-btn" @click="closeOrderDetail">&times;</button>
        </div>
        <div class="modal-body">
          <div class="order-detail-info">
            <div class="info-group">
              <div class="info-label">Khách hàng:</div>
              <div class="info-value">{{ selectedOrder.customer }}</div>
            </div>
            <div class="info-group">
              <div class="info-label">Số điện thoại:</div>
              <div class="info-value">{{ selectedOrder.phone }}</div>
            </div>
            <div class="info-group">
              <div class="info-label">Địa chỉ:</div>
              <div class="info-value">{{ selectedOrder.address }}</div>
            </div>
            <div class="info-group">
              <div class="info-label">Ngày đặt:</div>
              <div class="info-value">{{ formatDate(selectedOrder.orderDate) }}</div>
            </div>
            <div class="info-group">
              <div class="info-label">Ngày giao dự kiến:</div>
              <div class="info-value">{{ formatDate(selectedOrder.estimatedDelivery) }}</div>
            </div>
            <div class="info-group">
              <div class="info-label">Phương thức thanh toán:</div>
              <div class="info-value">{{ selectedOrder.paymentMethod }}</div>
            </div>
            <div class="info-group">
              <div class="info-label">Trạng thái:</div>
              <div class="info-value">
                <span class="status-badge" :class="getStatusClass(selectedOrder.status)">
                  {{ getStatusText(selectedOrder.status) }}
                </span>
              </div>
            </div>
          </div>
          
          <div class="product-list">
            <h4>Danh sách sản phẩm</h4>
            <table class="product-table">
              <thead>
                <tr>
                  <th>Sản phẩm</th>
                  <th>Đơn giá</th>
                  <th>Số lượng</th>
                  <th>Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="product in selectedOrder.products" :key="product.id">
                  <td>{{ product.name }}</td>
                  <td>{{ formatCurrency(product.price) }}</td>
                  <td>{{ product.quantity }}</td>
                  <td>{{ formatCurrency(product.price * product.quantity) }}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="3" class="total-label">Tổng tiền</td>
                  <td class="total-value">{{ formatCurrency(calculateTotal(selectedOrder)) }}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-close" @click="closeOrderDetail">Đóng</button>
          <button 
            v-if="canMoveNext(selectedOrder)"
            class="btn btn-next"
            @click="moveToNextStatusAndClose(selectedOrder)"
          >
            {{ getNextActionText(selectedOrder) }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OrderManagement',
  data() {
    return {
      currentTab: 'all', // Mặc định hiển thị tab tất cả đơn hàng
      selectedOrder: {},
      showOrderDetail: false, // Để kiểm soát hiển thị modal
      tabs: [
        { id: 'all', name: 'Tất cả đơn' },
        { id: 'new', name: 'Đơn mới' },
        { id: 'confirmed', name: 'Đã xác nhận' },
        { id: 'shipping', name: 'Đang vận chuyển' },
        { id: 'completed', name: 'Hoàn thành' }
      ],
      orders: [
        {
          id: '12345',
          customer: 'Nguyễn Văn A',
          phone: '0912345678',
          address: '123 Đường Lê Lợi, Quận 1, TP.HCM',
          orderDate: new Date(2025, 4, 5),
          estimatedDelivery: new Date(2025, 4, 8),
          status: 'new',
          paymentMethod: 'COD - Thanh toán khi nhận hàng',
          products: [
            { id: 1, name: 'Áo thun nam', price: 250000, quantity: 2 },
            { id: 2, name: 'Quần jeans', price: 450000, quantity: 1 }
          ]
        },
        {
          id: '12346',
          customer: 'Trần Thị B',
          phone: '0987654321',
          address: '456 Đường Nguyễn Huệ, Quận 1, TP.HCM',
          orderDate: new Date(2025, 4, 4),
          estimatedDelivery: new Date(2025, 4, 7),
          status: 'new',
          paymentMethod: 'Chuyển khoản ngân hàng',
          products: [
            { id: 3, name: 'Váy dạ hội', price: 1500000, quantity: 1 }
          ]
        },
        {
          id: '12347',
          customer: 'Lê Văn C',
          phone: '0977123456',
          address: '789 Đường Lê Duẩn, Quận 3, TP.HCM',
          orderDate: new Date(2025, 4, 3),
          estimatedDelivery: new Date(2025, 4, 6),
          status: 'confirmed',
          paymentMethod: 'Ví điện tử MoMo',
          products: [
            { id: 4, name: 'Giày thể thao', price: 850000, quantity: 1 },
            { id: 5, name: 'Vớ nam', price: 50000, quantity: 3 }
          ]
        },
        {
          id: '12348',
          customer: 'Phạm Thị D',
          phone: '0966123789',
          address: '101 Đường Hai Bà Trưng, Quận 1, TP.HCM',
          orderDate: new Date(2025, 4, 2),
          estimatedDelivery: new Date(2025, 4, 5),
          status: 'shipping',
          paymentMethod: 'Thẻ tín dụng',
          products: [
            { id: 6, name: 'Laptop Dell XPS', price: 28500000, quantity: 1 }
          ]
        },
        {
          id: '12349',
          customer: 'Hoàng Văn E',
          phone: '0955789123',
          address: '222 Đường Nguyễn Đình Chiểu, Quận 3, TP.HCM',
          orderDate: new Date(2025, 4, 1),
          estimatedDelivery: new Date(2025, 4, 4),
          status: 'completed',
          paymentMethod: 'COD - Thanh toán khi nhận hàng',
          products: [
            { id: 7, name: 'Tai nghe không dây', price: 1200000, quantity: 1 },
            { id: 8, name: 'Chuột gaming', price: 750000, quantity: 1 }
          ]
        }
      ]
    };
  },
  methods: {
    filteredOrders(status) {
      // Nếu tab là 'all', trả về tất cả các đơn hàng
      if (status === 'all') {
        return this.orders;
      }
      // Ngược lại, lọc theo trạng thái
      return this.orders.filter(order => order.status === status);
    },
    formatDate(date) {
      if (!(date instanceof Date)) {
        date = new Date(date);
      }
      return date.toLocaleDateString('vi-VN');
    },
    formatCurrency(value) {
      return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    },
    calculateTotal(order) {
      return order.products.reduce((total, product) => {
        return total + (product.price * product.quantity);
      }, 0);
    },
    getStatusText(status) {
      switch(status) {
        case 'new': return 'Đơn mới';
        case 'confirmed': return 'Đã xác nhận';
        case 'shipping': return 'Đang vận chuyển';
        case 'completed': return 'Hoàn thành';
        default: return '';
      }
    },
    getStatusClass(status) {
      switch(status) {
        case 'new': return 'status-new';
        case 'confirmed': return 'status-confirmed';
        case 'shipping': return 'status-shipping';
        case 'completed': return 'status-completed';
        default: return '';
      }
    },
    getNextStatus(currentStatus) {
      switch(currentStatus) {
        case 'new': return 'confirmed';
        case 'confirmed': return 'shipping';
        case 'shipping': return 'completed';
        default: return null;
      }
    },
    getNextActionText(order) {
      switch(order.status) {
        case 'new': return 'Xác nhận';
        case 'confirmed': return 'Giao hàng';
        case 'shipping': return 'Hoàn thành';
        default: return '';
      }
    },
    canMoveNext(order) {
      return order.status !== 'completed';
    },
    moveToNextStatus(order) {
      const nextStatus = this.getNextStatus(order.status);
      if (nextStatus) {
        // Tìm đơn hàng trong danh sách gốc và cập nhật
        const orderIndex = this.orders.findIndex(o => o.id === order.id);
        if (orderIndex !== -1) {
          this.orders[orderIndex].status = nextStatus;
          // Cập nhật lại trạng thái cho đơn hàng được chọn
          if (this.selectedOrder && this.selectedOrder.id === order.id) {
            this.selectedOrder.status = nextStatus;
          }
        }
      }
    },
    moveToNextStatusAndClose(order) {
      this.moveToNextStatus(order);
      this.showOrderDetail = false;
    },
    openOrderDetail(order) {
      this.selectedOrder = {...order};
      // Thêm logic hiển thị chi tiết đơn hàng ở đây (có thể mở modal hoặc chuyển view)
      console.log('Mở chi tiết đơn hàng:', order);
    }
  }
};
</script>

<style scoped>
:root {
  --primary: #4c75f2;
  --success: #28a745;
  --warning: #ffc107;
  --danger: #dc3545;
  --light: #f8f9fa;
  --dark: #343a40;
  --gray: #6c757d;
}

.card-header {
  padding: 15px 20px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #eee;
}

.title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.card-body {
  padding: 20px;
}

.tab-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.tabs {
  display: flex;
  border-bottom: 1px solid #eee;
}

.tab {
  padding: 15px 20px;
  cursor: pointer;
  font-weight: 500;
  position: relative;
  transition: all 0.3s ease;
  flex: 1;
  text-align: center;
}

.tab.active {
  color: var(--primary, #4c75f2);
}

.tab.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background-color: var(--primary, #4c75f2);
}

.tab-content {
  padding: 20px;
}

.status-badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.status-new {
  background-color: rgba(76, 117, 242, 0.1);
  color: #4c75f2;
}

.status-confirmed {
  background-color: rgba(255, 193, 7, 0.1);
  color: #ffc107;
}

.status-shipping {
  background-color: rgba(220, 53, 69, 0.1);
  color: #dc3545;
}

.status-completed {
  background-color: rgba(40, 167, 69, 0.1);
  color: #28a745;
}

.order-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.order-item {
  background: white;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
}

.order-item:hover {
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.order-info {
  flex: 1;
}

.order-info-status {
  margin-right: 10px;
}

.order-id {
  font-weight: 600;
  margin-bottom: 5px;
  color: #343a40;
}

.order-customer {
  margin-bottom: 5px;
  color: #343a40;
}

.order-date, .order-address {
  font-size: 14px;
  color: #6c757d;
  margin-bottom: 5px;
}

.order-actions {
  display: flex;
  gap: 10px;
}

.btn {
  padding: 8px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-detail {
  background-color: #6c757d;
  color: white;
  border: none;
}

.btn-close {
  background-color: #f8f9fa;
  color: #343a40;
  border: 1px solid #dee2e6;
}

.btn-next {
  background-color: #4c75f2;
  color: white;
}

.btn:hover {
  opacity: 0.9;
}

.empty-state {
  text-align: center;
  padding: 40px 0;
  color: #6c757d;
}

.empty-state i {
  font-size: 50px;
  margin-bottom: 15px;
  opacity: 0.5;
}

.empty-state p {
  font-size: 16px;
}

/* Responsive */
@media (max-width: 768px) {
  .tabs {
    flex-wrap: wrap;
  }
  
  .tab {
    flex-basis: 50%;
  }
  
  .order-item {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .order-actions {
    margin-top: 15px;
    width: 100%;
    justify-content: flex-end;
  }
  
  .modal-container {
    width: 95%;
  }
  
  .info-group {
    flex-direction: column;
  }
  
  .info-label {
    width: 100%;
    margin-bottom: 5px;
  }
  
  .product-table {
    display: block;
    overflow-x: auto;
  }
}
</style>