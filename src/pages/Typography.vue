<template>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <h1>
        <i class="fas fa-clock"></i>
        Quản lý thời gian làm việc nhân viên
      </h1>
    </div>

    <!-- Search -->
    <div class="search-container">
      <input
        type="text"
        v-model="searchTerm"
        placeholder="Tìm kiếm theo tên nhân viên..."
        @input="filterEmployees"
      />
      <select v-model="filterRole" @change="filterEmployees">
        <option value="">Tất cả vị trí</option>
        <option value="Nhân viên bưu cục">Nhân viên bưu cục</option>
        <option value="Nhân viên quản lý">Nhân viên quản lý</option>
        <option value="Tài xế">Tài xế</option>
      </select>
      <select v-model="filterStatus" @change="filterEmployees">
        <option value="">Tất cả trạng thái</option>
        <option value="checked-in">Đã check-in</option>
        <option value="checked-out">Đã check-out</option>
        <option value="not-checked-in">Chưa check-in</option>
      </select>
      <input type="date" v-model="selectedDate" @change="changeDate" />
    </div>

    <!-- Dashboard Cards (Today Only) -->
    <div v-if="isToday" class="dashboard-cards">
      <div class="card" @click="toggleTab('not-checked-in')">
        Chưa check-in ({{ notCheckedInToday.length }})
      </div>
      <div class="card" @click="toggleTab('working')">
        Đang làm việc ({{ checkedInNotOutToday.length }})
      </div>
      <div class="card" @click="toggleTab('checked-out')">
        Đã check-out ({{ checkedOutToday.length }})
      </div>
    </div>

    <!-- Tables -->
    <div v-if="isToday && activeTab === 'not-checked-in'" class="table-container">
      <h2>Nhân viên chưa check-in</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên</th>
            <th>Vị trí</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="employee in notCheckedInToday" :key="employee.id">
            <td>{{ employee.id }}</td>
            <td>{{ employee.name }}</td>
            <td>{{ employee.role }}</td>
            <td>
              <button @click="checkIn(employee)">Check-in</button>
            </td>
          </tr>
          <tr v-if="notCheckedInToday.length === 0">
            <td colspan="4">Tất cả nhân viên đã check-in</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="isToday && activeTab === 'working'" class="table-container">
      <h2>Nhân viên đang làm việc</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên</th>
            <th>Vị trí</th>
            <th>Check-in</th>
            <th>Thời gian</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="employee in checkedInNotOutToday" :key="employee.id">
            <td>{{ employee.id }}</td>
            <td>{{ employee.name }}</td>
            <td>{{ employee.role }}</td>
            <td>{{ formatTime(employee.checkInTime) }}</td>
            <td>{{ calculateCurrentWorkTime(employee) }}</td>
            <td>
              <button @click="checkOut(employee)">Check-out</button>
            </td>
          </tr>
          <tr v-if="checkedInNotOutToday.length === 0">
            <td colspan="6">Không có ai đang làm việc</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="isToday && activeTab === 'checked-out'" class="table-container">
      <h2>Nhân viên đã check-out</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên</th>
            <th>Vị trí</th>
            <th>Check-in</th>
            <th>Check-out</th>
            <th>Tổng</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="employee in checkedOutToday" :key="employee.id">
            <td>{{ employee.id }}</td>
            <td>{{ employee.name }}</td>
            <td>{{ employee.role }}</td>
            <td>{{ formatTime(employee.checkInTime) }}</td>
            <td>{{ formatTime(employee.checkOutTime) }}</td>
            <td>{{ calculateWorkingHours(employee) }}</td>
          </tr>
          <tr v-if="checkedOutToday.length === 0">
            <td colspan="6">Không có ai đã check-out</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Main Table -->
    <div class="table-container">
      <h2>Thời gian làm việc: {{ formattedSelectedDate }}</h2>
      <div class="date-navigation">
        <button @click="previousDay">&lt;&lt;</button>
        <button @click="nextDay">&gt;&gt;</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên</th>
            <th>Vị trí</th>
            <th>Check-in</th>
            <th>Check-out</th>
            <th>Tổng</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="employee in filteredEmployees" :key="employee.id">
            <td>{{ employee.id }}</td>
            <td>{{ employee.name }}</td>
            <td>{{ employee.role }}</td>
            <td>{{ formatTime(employee.checkInTime) }}</td>
            <td>{{ formatTime(employee.checkOutTime) }}</td>
            <td>{{ calculateWorkingHours(employee) }}</td>
            <td>{{ getStatus(employee) }}</td>
          </tr>
          <tr v-if="filteredEmployees.length === 0">
            <td colspan="7">Không tìm thấy dữ liệu</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentUser: {
        id: 0,
        name: 'Admin',
        role: 'Admin',
        isAdmin: true,
      },
      employees: [
        {
          id: 1,
          name: 'Nguyễn Văn A',
          role: 'Nhân viên bưu cục',
          checkInTime: null,
          checkOutTime: null,
        },
        {
          id: 2,
          name: 'Trần Thị B',
          role: 'Nhân viên quản lý',
          checkInTime: null,
          checkOutTime: null,
        },
        { id: 3, name: 'Lê Văn C', role: 'Tài xế', checkInTime: null, checkOutTime: null },
        {
          id: 4,
          name: 'Phạm Thị D',
          role: 'Nhân viên bưu cục',
          checkInTime: null,
          checkOutTime: null,
        },
        { id: 5, name: 'Hoàng Văn E', role: 'Tài xế', checkInTime: null, checkOutTime: null },
      ],
      historicalData: {
        '2025-05-06': [
          {
            id: 1,
            name: 'Nguyễn Văn A',
            role: 'Nhân viên bưu cục',
            checkInTime: '2025-05-06T07:30:00',
            checkOutTime: '2025-05-06T17:15:00',
          },
          {
            id: 2,
            name: 'Trần Thị B',
            role: 'Nhân viên quản lý',
            checkInTime: '2025-05-06T07:45:00',
            checkOutTime: '2025-05-06T18:00:00',
          },
          {
            id: 3,
            name: 'Lê Văn C',
            role: 'Tài xế',
            checkInTime: '2025-05-06T06:00:00',
            checkOutTime: '2025-05-06T16:30:00',
          },
          {
            id: 4,
            name: 'Phạm Thị D',
            role: 'Nhân viên bưu cục',
            checkInTime: '2025-05-06T08:00:00',
            checkOutTime: '2025-05-06T17:00:00',
          },
          {
            id: 5,
            name: 'Hoàng Văn E',
            role: 'Tài xế',
            checkInTime: '2025-05-06T06:15:00',
            checkOutTime: '2025-05-06T15:45:00',
          },
        ],
        '2025-05-05': [
          {
            id: 1,
            name: 'Nguyễn Văn A',
            role: 'Nhân viên bưu cục',
            checkInTime: '2025-05-05T07:45:00',
            checkOutTime: '2025-05-05T17:30:00',
          },
          {
            id: 2,
            name: 'Trần Thị B',
            role: 'Nhân viên quản lý',
            checkInTime: '2025-05-05T07:30:00',
            checkOutTime: '2025-05-05T17:45:00',
          },
          {
            id: 3,
            name: 'Lê Văn C',
            role: 'Tài xế',
            checkInTime: '2025-05-05T06:30:00',
            checkOutTime: '2025-05-05T16:00:00',
          },
          {
            id: 4,
            name: 'Phạm Thị D',
            role: 'Nhân viên bưu cục',
            checkInTime: '2025-05-05T07:50:00',
            checkOutTime: '2025-05-05T17:20:00',
          },
          {
            id: 5,
            name: 'Hoàng Văn E',
            role: 'Tài xế',
            checkInTime: '2025-05-05T06:00:00',
            checkOutTime: '2025-05-05T16:15:00',
          },
        ],
      },
      searchTerm: '',
      filterRole: '',
      filterStatus: '',
      selectedDate: new Date().toISOString().split('T')[0],
      filteredEmployees: [],
      todayDate: new Date().toISOString().split('T')[0],
      activeTab: null,
    };
  },
  computed: {
    isToday() {
      return this.selectedDate === this.todayDate;
    },
    formattedSelectedDate() {
      const date = new Date(this.selectedDate);
      return date.toLocaleDateString('vi-VN', {
        weekday: 'long',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    },
    notCheckedInToday() {
      if (!this.isToday) return [];
      return this.employees.filter((emp) => !emp.checkInTime);
    },
    checkedInNotOutToday() {
      if (!this.isToday) return [];
      return this.employees.filter((emp) => emp.checkInTime && !emp.checkOutTime);
    },
    checkedOutToday() {
      if (!this.isToday) return [];
      return this.employees.filter((emp) => emp.checkInTime && emp.checkOutTime);
    },
  },
  mounted() {
    this.loadEmployeeData();
    this.filterEmployees();
  },
  methods: {
    toggleTab(tabName) {
      this.activeTab = this.activeTab === tabName ? null : tabName;
    },
    filterEmployees() {
      let result = this.isToday
        ? [...this.employees]
        : this.historicalData[this.selectedDate] || [];

      if (this.searchTerm) {
        result = result.filter(
          (emp) =>
            emp.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
            emp.id.toString().includes(this.searchTerm)
        );
      }

      if (this.filterRole) {
        result = result.filter((emp) => emp.role === this.filterRole);
      }

      if (this.filterStatus) {
        if (this.filterStatus === 'checked-in') {
          result = result.filter((emp) => emp.checkInTime && !emp.checkOutTime);
        } else if (this.filterStatus === 'checked-out') {
          result = result.filter((emp) => emp.checkInTime && emp.checkOutTime);
        } else if (this.filterStatus === 'not-checked-in') {
          result = result.filter((emp) => !emp.checkInTime);
        }
      }

      this.filteredEmployees = result;
    },
    checkIn(employee) {
      if (this.isToday && employee.id === this.currentUser.id) {
        const empIndex = this.employees.findIndex((emp) => emp.id === employee.id);
        if (empIndex !== -1) {
          this.employees[empIndex].checkInTime = new Date().toISOString();
          this.saveAttendanceData();
          this.filterEmployees();
          this.showNotification('Check-in thành công', 'success');
        }
      }
    },
    checkOut(employee) {
      if (this.isToday && employee.id === this.currentUser.id) {
        const empIndex = this.employees.findIndex((emp) => emp.id === employee.id);
        if (empIndex !== -1) {
          this.employees[empIndex].checkOutTime = new Date().toISOString();
          this.saveAttendanceData();
          this.filterEmployees();
          this.showNotification('Check-out thành công', 'success');
        }
      }
    },
    showNotification(message, type = 'info') {
      alert(message);
    },
    saveAttendanceData() {
      localStorage.setItem('attendanceData', JSON.stringify(this.employees));
    },
    loadEmployeeData() {
      const savedData = localStorage.getItem('attendanceData');
      if (savedData) {
        this.employees = JSON.parse(savedData);
      }
    },
    showEmployeeLog(employee) {
      alert(`Lịch sử điểm danh của ${employee.name} sẽ hiển thị ở đây`);
    },
    formatTime(timestamp) {
      if (!timestamp) return '—';
      const date = new Date(timestamp);
      return date.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
      });
    },
    calculateWorkingHours(employee) {
      if (!employee.checkInTime) return '—';

      const checkIn = new Date(employee.checkInTime);
      const checkOut = employee.checkOutTime ? new Date(employee.checkOutTime) : null;

      if (!checkOut) return 'Đang làm việc';

      const diffMs = checkOut - checkIn;
      const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMins = Math.round((diffMs % (1000 * 60 * 60)) / (1000 * 60));

      return `${diffHrs} giờ ${diffMins} phút`;
    },
    calculateCurrentWorkTime(employee) {
      if (!employee.checkInTime) return '—';

      const checkIn = new Date(employee.checkInTime);
      const now = new Date();

      const diffMs = now - checkIn;
      const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMins = Math.round((diffMs % (1000 * 60 * 60)) / (1000 * 60));

      return `${diffHrs} giờ ${diffMins} phút`;
    },
    getStatus(employee) {
      if (!employee.checkInTime) return 'Chưa check-in';
      if (!employee.checkOutTime) return 'Đang làm việc';
      return 'Đã check-out';
    },
    changeDate() {
      this.filterEmployees();
    },
    previousDay() {
      const date = new Date(this.selectedDate);
      date.setDate(date.getDate() - 1);
      this.selectedDate = date.toISOString().split('T')[0];
      this.filterEmployees();
    },
    nextDay() {
      const date = new Date(this.selectedDate);
      date.setDate(date.getDate() + 1);
      this.selectedDate = date.toISOString().split('T')[0];
      this.filterEmployees();
    },
  },
};
</script>

<style scoped>
/* Elegant styling for employee time management */
/* Enhanced styling for employee time management with white and blue theme */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 25px;
  font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  color: #2c3e50;
  background-color: #ffffff;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.08);
  border-radius: 10px;
}

.header {
  margin-bottom: 30px;
  text-align: center;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 20px;
  position: relative;
}

.header h1 {
  font-size: 2em;
  color: #010101;
  font-weight: 600;
  margin: 0;
  letter-spacing: 0.5px;
}

.header h1 i {
  color: #1e88e5;
  margin-right: 12px;
}

.search-container {
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
  flex-wrap: wrap;
  background-color: #f5f9ff;
  padding: 18px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(30, 136, 229, 0.08);
}

.search-container input,
.search-container select {
  padding: 12px 15px;
  border: 1px solid #e1e7f0;
  border-radius: 6px;
  flex: 1;
  min-width: 150px;
  font-size: 14px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
  color: #2c3e50;
  background-color: white;
}

.search-container input:focus,
.search-container select:focus {
  border-color: #1e88e5;
  outline: none;
  box-shadow: 0 1px 5px rgba(30, 136, 229, 0.2);
}

.search-container input::placeholder {
  color: #a0aec0;
}

.dashboard-cards {
  display: flex;
  gap: 18px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.card {
  background-color: #ffffff;
  border: 1px solid #e1e7f0;
  border-left: 4px solid #1e88e5;
  border-radius: 6px;
  padding: 18px 20px;
  cursor: pointer;
  text-align: center;
  flex: 1;
  min-width: 200px;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  font-weight: 500;
  color: #1e88e5;
}

.card:nth-child(1) {
  border-left-color: #e53935;
  color: #e53935;
}

.card:nth-child(2) {
  border-left-color: #43a047;
  color: #43a047;
}

.card:nth-child(3) {
  border-left-color: #1e88e5;
}

.card:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 12px rgba(0, 0, 0, 0.1);
  background-color: #f9fbff;
}

.table-container {
  margin-bottom: 35px;
  background-color: #ffffff;
  border-radius: 8px;
  padding: 22px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.06);
  position: relative;
  overflow: hidden;
  border: 1px solid #f0f4f8;
}

.table-container:before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(to right, #151617, #252626);
}

.table-container h2 {
  font-size: 1.4em;
  margin-bottom: 20px;
  color: #0e0e0f;
  font-weight: 500;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f4f8;
  display: flex;
  align-items: center;
}

.table-container h2:before {
  content: '';
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #0d0d0e;
  margin-right: 10px;
}

.date-navigation {
  text-align: center;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.date-navigation button {
  padding: 10px 18px;
  border: 1px solid #e1e7f0;
  border-radius: 6px;
  cursor: pointer;
  background-color: white;
  transition: all 0.3s ease;
  color: #1e88e5;
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.03);
}

.date-navigation button:hover {
  background-color: #f5f9ff;
  border-color: #1e88e5;
  box-shadow: 0 3px 8px rgba(30, 136, 229, 0.15);
}

table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 14px;
}

th, td {
  padding: 14px 16px;
  border-bottom: 1px solid #f0f4f8;
  text-align: left;
  transition: background-color 0.2s ease;
}

th {
  background-color: #f5f9ff;
  font-weight: 600;
  position: sticky;
  top: 0;
  letter-spacing: 0.3px;
  border-top: 1px solid #e1e7f0;
  border-bottom: 2px solid #bbdefb;
}

th:first-child {
  border-top-left-radius: 6px;
  border-left: 1px solid #e1e7f0;
}

th:last-child {
  border-top-right-radius: 6px;
  border-right: 1px solid #e1e7f0;
}

tr:last-child td {
  border-bottom: none;
}

tr:hover td {
  background-color: #f5f9ff;
}

tr td:first-child {
  font-weight: 500;
}

button {
  padding: 9px 14px;
  background-color: white;
  border: 1px solid #e1e7f0;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #1e88e5;
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.03);
}

button:hover {
  background-color: #f5f9ff;
  border-color: #1e88e5;
  box-shadow: 0 3px 8px rgba(30, 136, 229, 0.15);
}

button.primary {
  background-color: #1e88e5;
  color: white;
  border-color: #1e88e5;
}

button.primary:hover {
  background-color: #1976d2;
  border-color: #1976d2;
  box-shadow: 0 2px 10px rgba(25, 118, 210, 0.25);
}

/* Status styling */
.status-badge {
  display: inline-block;
  padding: 6px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.3px;
}

.status-working {
  background-color: #e3f2fd;
  color: #1976d2;
  border: 1px solid #bbdefb;
}

.status-checked-out {
  background-color: #e8f5e9;
  color: #388e3c;
  border: 1px solid #c8e6c9;
}

.status-not-checked {
  background-color: #ffebee;
  color: #d32f2f;
  border: 1px solid #ffcdd2;
}

/* Animation for cards */
@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
  100% {
    transform: scale(1);
  }
}

.card:hover {
  animation: pulse 1s infinite;
}

/* Time styling */
td:nth-child(4), 
td:nth-child(5) {
  color: #546e7a;
  font-family: 'Courier New', monospace;
  font-weight: 600;
}

/* Add responsive styling */
@media (max-width: 768px) {
  .container {
    padding: 15px;
    border-radius: 8px;
  }
  
  .search-container {
    flex-direction: column;
    padding: 12px;
  }
  
  .dashboard-cards {
    flex-direction: column;
  }
  
  .card {
    min-width: auto;
    margin-bottom: 10px;
  }
  
  table {
    font-size: 13px;
  }
  
  th, td {
    padding: 10px 12px;
  }
  
  .header h1 {
    font-size: 1.5em;
  }
}

/* Add beautiful scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f0f4f8;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: #bbdefb;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #90caf9;
}

/* Additional eye-catching elements */
.header:after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 3px;
  background: linear-gradient(to right, #1e88e5, #64b5f6);
  border-radius: 3px;
}

.container {
  position: relative;
  overflow: hidden;
}

.container:after {
  content: '';
  position: absolute;
  top: -50px;
  right: -50px;
  width: 100px;
  height: 100px;
  background-color: rgba(30, 136, 229, 0.08);
  border-radius: 50%;
  z-index: -1;
}

.container:before {
  content: '';
  position: absolute;
  bottom: -30px;
  left: -30px;
  width: 80px;
  height: 80px;
  background-color: rgba(30, 136, 229, 0.05);
  border-radius: 50%;
  z-index: -1;
}
</style>