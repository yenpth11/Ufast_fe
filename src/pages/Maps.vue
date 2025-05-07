<template>
  <div class="partner-management">
    <div class="menu-container">
      <div
  class="menu-item"
  :class="{ active: activeTab === 'partners' }"
  @click="activeTab = 'partners'"
>
  <i class="fas fa-handshake" style="margin-right: 6px;"></i>
  Đối tác (2)
</div>

<div
  class="menu-item"
  :class="{ active: activeTab === 'requests' }"
  @click="activeTab = 'requests'"
>
  <i class="fas fa-bell" style="margin-right: 6px;"></i>
  Yêu cầu mới (4)
</div>

<div
  class="menu-item"
  :class="{ active: activeTab === 'accounts' }"
  @click="activeTab = 'accounts'"
>
  <i class="fas fa-user" style="margin-right: 6px;"></i>
  Tài khoản (3)
</div>

</div>

      <div class="content">
        <!-- Dashboard tab -->
        <div v-if="activeTab === 'dashboard'" class="dashboard">
          <h2>Tổng quan</h2>
          <div class="stats">
            <div class="stat-card">
              <div class="stat-value">{{ partners.length }}</div>
              <div class="stat-label">Tổng số đối tác</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">{{ pendingRequests.length }}</div>
              <div class="stat-label">Yêu cầu mới</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">{{ activePartners }}</div>
              <div class="stat-label">Đối tác hoạt động</div>
            </div>
          </div>

          <div class="recent-activities">
            <h3>Hoạt động gần đây</h3>
            <ul class="activities-list">
              <li v-for="(activity, index) in recentActivities" :key="index">
                <div class="activity-time">{{ activity.time }}</div>
                <div class="activity-content">{{ activity.content }}</div>
              </li>
            </ul>
          </div>
        </div>

        <!-- Partners tab -->
        <div v-if="activeTab === 'partners'" class="partners">
          <div class="section-header">
            <h2>Danh sách đối tác</h2>
            <button class="btn-primary" @click="showAddPartnerModal = true">
              <i class="fas fa-plus"></i> Thêm đối tác
            </button>
          </div>

          <div class="filter-bar">
            <div class="search">
              <input type="text" placeholder="Tìm kiếm đối tác..." v-model="partnerSearch">
            </div>
            <div class="filter">
              <select v-model="partnerStatusFilter">
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Hoạt động</option>
                <option value="inactive">Không hoạt động</option>
              </select>
            </div>
          </div>

          <table class="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên đối tác</th>
                <th>Email</th>
                <th>Số điện thoại</th>
                <th>Ngày tham gia</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="partner in filteredPartners" :key="partner.id">
                <td>{{ partner.id }}</td>
                <td>{{ partner.name }}</td>
                <td>{{ partner.email }}</td>
                <td>{{ partner.phone }}</td>
                <td>{{ partner.joinDate }}</td>
                <td>
                  <span :class="['status', partner.status]">
                    {{ partner.status === 'active' ? 'Hoạt động' : 'Không hoạt động' }}
                  </span>
                </td>
                <td>
                  <div class="actions">
                    <button class="btn-view" @click="viewPartnerDetails(partner)">
                      <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-edit" @click="editPartner(partner)">
                      <i class="fas fa-edit"></i>
                    </button>
                    <button v-if="partner.status === 'active'" class="btn-deactivate" @click="togglePartnerStatus(partner)">
                      <i class="fas fa-ban"></i>
                    </button>
                    <button v-else class="btn-activate" @click="togglePartnerStatus(partner)">
                      <i class="fas fa-check"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <div v-if="filteredPartners.length === 0" class="no-data">
            Không tìm thấy đối tác nào
          </div>

          <div class="pagination">
            <button :disabled="currentPage === 1" @click="currentPage--">
              <i class="fas fa-chevron-left"></i>
            </button>
            <span>Trang {{ currentPage }} / {{ totalPages }}</span>
            <button :disabled="currentPage === totalPages" @click="currentPage++">
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>

        <!-- New Requests tab -->
        <div v-if="activeTab === 'requests'" class="requests">
          <h2>Yêu cầu đối tác mới</h2>
          
          <div class="empty-state" v-if="pendingRequests.length === 0">
            <i class="fas fa-inbox"></i>
            <p>Không có yêu cầu đối tác mới</p>
          </div>
          
          <div v-else class="request-cards">
            <div v-for="request in pendingRequests" :key="request.id" class="request-card">
              <div class="request-header">
                <h3>{{ request.companyName }}</h3>
                <span class="request-time">{{ request.requestDate }}</span>
              </div>
              <div class="request-details">
                <div class="detail-row">
                  <span class="label">Người đại diện:</span>
                  <span>{{ request.contactPerson }}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Email:</span>
                  <span>{{ request.email }}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Số điện thoại:</span>
                  <span>{{ request.phone }}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Địa chỉ:</span>
                  <span>{{ request.address }}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Loại hình doanh nghiệp:</span>
                  <span>{{ request.businessType }}</span>
                </div>
              </div>
              <div class="request-actions">
                <button class="btn-view" @click="viewRequestDetails(request)">
                  Chi tiết
                </button>
                <button class="btn-approve" @click="showApproveModal(request)">
                  Duyệt
                </button>
                <button class="btn-reject" @click="showRejectModal(request)">
                  Từ chối
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Accounts tab -->
        <div v-if="activeTab === 'accounts'" class="accounts">
          <div class="section-header">
            <h2>Quản lý tài khoản đối tác</h2>
          </div>

          <div class="filter-bar">
            <div class="search">
              <input type="text" placeholder="Tìm kiếm tài khoản..." v-model="accountSearch">
            </div>
            <div class="filter">
              <select v-model="accountStatusFilter">
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Hoạt động</option>
                <option value="inactive">Khóa</option>
              </select>
            </div>
          </div>

          <table class="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên đăng nhập</th>
                <th>Đối tác</th>
                <th>Email</th>
                <th>Ngày tạo</th>
                <th>Lần đăng nhập cuối</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="account in filteredAccounts" :key="account.id">
                <td>{{ account.id }}</td>
                <td>{{ account.username }}</td>
                <td>{{ account.partnerName }}</td>
                <td>{{ account.email }}</td>
                <td>{{ account.createdAt }}</td>
                <td>{{ account.lastLogin }}</td>
                <td>
                  <span :class="['status', account.status]">
                    {{ account.status === 'active' ? 'Hoạt động' : 'Khóa' }}
                  </span>
                </td>
                <td>
                  <div class="actions">
                    <button class="btn-reset" @click="showResetPasswordModal(account)">
                      <i class="fas fa-key"></i>
                    </button>
                    <button v-if="account.status === 'active'" class="btn-deactivate" @click="toggleAccountStatus(account)">
                      <i class="fas fa-lock"></i>
                    </button>
                    <button v-else class="btn-activate" @click="toggleAccountStatus(account)">
                      <i class="fas fa-unlock"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <div v-if="filteredAccounts.length === 0" class="no-data">
            Không tìm thấy tài khoản nào
          </div>
        </div>

        <!-- Settings tab -->
        <div v-if="activeTab === 'settings'" class="settings">
          <h2>Cài đặt hệ thống</h2>
          <!-- Settings content would go here -->
        </div>
      </div>

    <!-- Modal for viewing partner details -->
    <div class="modal" v-if="showPartnerModal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Thông tin chi tiết đối tác</h2>
          <button class="btn-close" @click="showPartnerModal = false">&times;</button>
        </div>
        <div class="modal-body" v-if="selectedPartner">
          <div class="partner-info">
            <div class="info-section">
              <h3>Thông tin chung</h3>
              <div class="info-row">
                <span class="label">ID:</span>
                <span>{{ selectedPartner.id }}</span>
              </div>
              <div class="info-row">
                <span class="label">Tên đối tác:</span>
                <span>{{ selectedPartner.name }}</span>
              </div>
              <div class="info-row">
                <span class="label">Email:</span>
                <span>{{ selectedPartner.email }}</span>
              </div>
              <div class="info-row">
                <span class="label">Số điện thoại:</span>
                <span>{{ selectedPartner.phone }}</span>
              </div>
              <div class="info-row">
                <span class="label">Địa chỉ:</span>
                <span>{{ selectedPartner.address }}</span>
              </div>
              <div class="info-row">
                <span class="label">Ngày tham gia:</span>
                <span>{{ selectedPartner.joinDate }}</span>
              </div>
              <div class="info-row">
                <span class="label">Trạng thái:</span>
                <span :class="['status', selectedPartner.status]">
                  {{ selectedPartner.status === 'active' ? 'Hoạt động' : 'Không hoạt động' }}
                </span>
              </div>
            </div>

            <div class="info-section">
              <h3>Thông tin doanh nghiệp</h3>
              <div class="info-row">
                <span class="label">Loại hình:</span>
                <span>{{ selectedPartner.businessType }}</span>
              </div>
              <div class="info-row">
                <span class="label">Mã số thuế:</span>
                <span>{{ selectedPartner.taxCode }}</span>
              </div>
              <div class="info-row">
                <span class="label">Website:</span>
                <span>
                  <a :href="selectedPartner.website" target="_blank">
                    {{ selectedPartner.website }}
                  </a>
                </span>
              </div>
            </div>

            <div class="info-section">
              <h3>Người đại diện</h3>
              <div class="info-row">
                <span class="label">Họ tên:</span>
                <span>{{ selectedPartner.representative }}</span>
              </div>
              <div class="info-row">
                <span class="label">Chức vụ:</span>
                <span>{{ selectedPartner.representativeTitle }}</span>
              </div>
              <div class="info-row">
                <span class="label">Email:</span>
                <span>{{ selectedPartner.representativeEmail }}</span>
              </div>
              <div class="info-row">
                <span class="label">Số điện thoại:</span>
                <span>{{ selectedPartner.representativePhone }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" @click="showPartnerModal = false">Đóng</button>
          <button class="btn-primary" @click="editPartner(selectedPartner)">Chỉnh sửa</button>
        </div>
      </div>
    </div>

    <!-- Modal for request details -->
    <div class="modal" v-if="showRequestModal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Chi tiết yêu cầu đối tác</h2>
          <button class="btn-close" @click="showRequestModal = false">&times;</button>
        </div>
        <div class="modal-body" v-if="selectedRequest">
          <div class="request-info">
            <div class="info-section">
              <h3>Thông tin doanh nghiệp</h3>
              <div class="info-row">
                <span class="label">Tên công ty:</span>
                <span>{{ selectedRequest.companyName }}</span>
              </div>
              <div class="info-row">
                <span class="label">Loại hình:</span>
                <span>{{ selectedRequest.businessType }}</span>
              </div>
              <div class="info-row">
                <span class="label">Mã số thuế:</span>
                <span>{{ selectedRequest.taxCode }}</span>
              </div>
              <div class="info-row">
                <span class="label">Địa chỉ:</span>
                <span>{{ selectedRequest.address }}</span>
              </div>
              <div class="info-row">
                <span class="label">Email:</span>
                <span>{{ selectedRequest.email }}</span>
              </div>
              <div class="info-row">
                <span class="label">Số điện thoại:</span>
                <span>{{ selectedRequest.phone }}</span>
              </div>
              <div class="info-row">
                <span class="label">Website:</span>
                <span>
                  <a :href="selectedRequest.website" target="_blank">
                    {{ selectedRequest.website }}
                  </a>
                </span>
              </div>
            </div>

            <div class="info-section">
              <h3>Người đại diện</h3>
              <div class="info-row">
                <span class="label">Họ tên:</span>
                <span>{{ selectedRequest.contactPerson }}</span>
              </div>
              <div class="info-row">
                <span class="label">Chức vụ:</span>
                <span>{{ selectedRequest.contactTitle }}</span>
              </div>
              <div class="info-row">
                <span class="label">Email:</span>
                <span>{{ selectedRequest.contactEmail }}</span>
              </div>
              <div class="info-row">
                <span class="label">Số điện thoại:</span>
                <span>{{ selectedRequest.contactPhone }}</span>
              </div>
            </div>

            <div class="info-section">
              <h3>Thông tin bổ sung</h3>
              <div class="info-row">
                <span class="label">Mô tả:</span>
                <div class="description">{{ selectedRequest.description }}</div>
              </div>
              <div class="info-row">
                <span class="label">Ngày yêu cầu:</span>
                <span>{{ selectedRequest.requestDate }}</span>
              </div>
              <div class="info-row">
                <span class="label">Tài liệu đính kèm:</span>
                <div class="attachments">
                  <div v-for="(doc, index) in selectedRequest.documents" :key="index" class="attachment">
                    <i class="fas fa-file-pdf"></i>
                    <span>{{ doc.name }}</span>
                    <button class="btn-view-doc">Xem</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" @click="showRequestModal = false">Đóng</button>
          <button class="btn-reject" @click="showRejectModal(selectedRequest)">Từ chối</button>
          <button class="btn-approve" @click="showApproveModal(selectedRequest)">Duyệt</button>
        </div>
      </div>
    </div>

    <!-- Modal for approving partner -->
    <div class="modal" v-if="showApprovePartnerModal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Duyệt đối tác mới</h2>
          <button class="btn-close" @click="showApprovePartnerModal = false">&times;</button>
        </div>
        <div class="modal-body" v-if="selectedRequest">
          <p>Bạn đang duyệt yêu cầu trở thành đối tác của <strong>{{ selectedRequest.companyName }}</strong>.</p>
          
          <div class="form-group">
            <label>Tên đối tác</label>
            <input type="text" v-model="newPartner.name" :placeholder="selectedRequest.companyName">
          </div>
          
          <div class="form-section">
            <h3>Thông tin tài khoản</h3>
            <p>Tạo tài khoản cho đối tác</p>
            
            <div class="form-group">
              <label>Tên đăng nhập</label>
              <input type="text" v-model="newPartner.account.username" :placeholder="generateUsername(selectedRequest.companyName)">
            </div>
            
            <div class="form-group">
              <label>Email</label>
              <input type="email" v-model="newPartner.account.email" :placeholder="selectedRequest.email">
            </div>
            
            <div class="form-group">
              <label>Mật khẩu</label>
              <div class="password-input">
                <input :type="showPassword ? 'text' : 'password'" v-model="newPartner.account.password">
                <button type="button" class="btn-toggle-password" @click="showPassword = !showPassword">
                  <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                </button>
                <button type="button" class="btn-generate-password" @click="generatePassword">
                  Tạo mật khẩu
                </button>
              </div>
            </div>
            
            <div class="form-group">
              <label>Quyền truy cập</label>
              <div class="role-options">
                <div class="role-option">
                  <input type="radio" id="role-admin" value="admin" v-model="newPartner.account.role">
                  <label for="role-admin">Admin</label>
                </div>
                <div class="role-option">
                  <input type="radio" id="role-manager" value="manager" v-model="newPartner.account.role">
                  <label for="role-manager">Quản lý</label>
                </div>
                <div class="role-option">
                  <input type="radio" id="role-user" value="user" v-model="newPartner.account.role">
                  <label for="role-user">Người dùng</label>
                </div>
              </div>
            </div>
          </div>
          
          <div class="form-section">
            <h3>Ghi chú</h3>
            <textarea v-model="newPartner.note" placeholder="Nhập ghi chú về đối tác này (không bắt buộc)"></textarea>
          </div>
          
          <div class="form-section">
            <h3>Thông báo</h3>
            <div class="notification-options">
              <div class="checkbox-option">
                <input type="checkbox" id="send-email" v-model="newPartner.sendEmail">
                <label for="send-email">Gửi email thông báo cho đối tác</label>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" @click="showApprovePartnerModal = false">Hủy</button>
          <button class="btn-primary" @click="approvePartner">Duyệt và tạo tài khoản</button>
        </div>
      </div>
    </div>

    <!-- Modal for rejecting partner -->
    <div class="modal" v-if="showRejectPartnerModal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Từ chối yêu cầu</h2>
          <button class="btn-close" @click="showRejectPartnerModal = false">&times;</button>
        </div>
        <div class="modal-body" v-if="selectedRequest">
          <p>Bạn đang từ chối yêu cầu trở thành đối tác của <strong>{{ selectedRequest.companyName }}</strong>.</p>
          
          <div class="form-group">
            <label>Lý do từ chối</label>
            <select v-model="rejectReason">
              <option value="">Chọn lý do</option>
              <option value="incomplete">Thông tin không đầy đủ</option>
              <option value="invalid">Thông tin không hợp lệ</option>
              <option value="policy">Không đáp ứng chính sách</option>
              <option value="other">Lý do khác</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>Ghi chú</label>
            <textarea v-model="rejectNote" placeholder="Nhập thông tin chi tiết về lý do từ chối"></textarea>
          </div>
          
          <div class="checkbox-option">
            <input type="checkbox" id="send-rejection-email" v-model="sendRejectionEmail">
            <label for="send-rejection-email">Gửi email thông báo cho đối tác</label>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" @click="showRejectPartnerModal = false">Hủy</button>
          <button class="btn-danger" @click="rejectPartner">Xác nhận từ chối</button>
        </div>
      </div>
    </div>

    <!-- Modal for resetting password -->
    <div class="modal" v-if="showResetPasswordModal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Đặt lại mật khẩu</h2>
          <button class="btn-close" @click="closeResetPasswordModal">&times;</button>
        </div>
        <div class="modal-body" v-if="selectedAccount">
          <p>Bạn đang đặt lại mật khẩu cho tài khoản <strong>{{ selectedAccount.username }}</strong>.</p>
          
          <div class="form-group">
            <label>Mật khẩu mới</label>
            <div class="password-input">
              <input :type="showNewPassword ? 'text' : 'password'" v-model="newPassword">
              <button type="button" class="btn-toggle-password" @click="showNewPassword = !showNewPassword">
                <i :class="showNewPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
              <button type="button" class="btn-generate-password" @click="generateNewPassword">
                Tạo mật khẩu
              </button>
            </div>
          </div>
          
          <div class="checkbox-option">
            <input type="checkbox" id="require-password-change" v-model="requirePasswordChange">
            <label for="require-password-change">Yêu cầu đổi mật khẩu khi đăng nhập</label>
          </div>
          
          <div class="checkbox-option">
            <input type="checkbox" id="send-password-email" v-model="sendPasswordEmail">
            <label for="send-password-email">Gửi email thông báo cho đối tác</label>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" @click="closeResetPasswordModal">Hủy</button>
          <button class="btn-primary" @click="resetPassword">Đặt lại mật khẩu</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PartnerManagement',
  data() {
    return {
      activeTab: 'dashboard',
      
      // Partners data
      partners: [
        {
          id: 'P001',
          name: 'Công ty TNHH ABC',
          email: 'contact@abc.com',
          phone: '0912345678',
          address: 'Số 123, Đường Lê Lợi, Quận 1, TP.HCM',
          joinDate: '01/03/2025',
          status: 'active',
          businessType: 'Công ty TNHH',
          taxCode: '0123456789',
          website: 'https://www.abc.com',
          representative: 'Nguyễn Văn A',
          representativeTitle: 'Giám đốc',
          representativeEmail: 'nguyen.van.a@abc.com',
          representativePhone: '0987654321'
        },
        {
          id: 'P002',
          name: 'Công ty CP XYZ',
          email: 'info@xyz.com',
          phone: '0923456789',
          address: 'Số 456, Đường Nguyễn Huệ, Quận 1, TP.HCM',
          joinDate: '15/03/2025',
          status: 'active',
          businessType: 'Công ty Cổ phần',
          taxCode: '9876543210',
          website: 'https://www.xyz.com',
          representative: 'Trần Thị B',
          representativeTitle: 'Chủ tịch HĐQT',
          representativeEmail: 'tran.thi.b@xyz.com',
          representativePhone: '0912345987'
        },
        {
          id: 'P003',
          name: 'Công ty TNHH DEF',
          email: 'support@def.com',
          phone: '0934567890',
          address: 'Số 789, Đường Trần Hưng Đạo, Quận 5, TP.HCM',
          joinDate: '05/04/2025',
          status: 'inactive',
          businessType: 'Công ty TNHH',
          taxCode: '5678901234',
          website: 'https://www.def.com',
          representative: 'Lê Văn C',
          representativeTitle: 'Giám đốc điều hành',
          representativeEmail: 'le.van.c@def.com',
          representativePhone: '0923456789'
        }
      ],
      
      // Partner search and filter
      partnerSearch: '',
      partnerStatusFilter: 'all',
      currentPage: 1,
      itemsPerPage: 10,
      
      // New partner requests
      pendingRequests: [
        {
          id: 'R001',
          companyName: 'Công ty TNHH Tech Solutions',
          businessType: 'Công ty TNHH',
          taxCode: '0123456789',
          address: 'Số 123, Đường Điện Biên Phủ, Quận 3, TP.HCM',
          email: 'info@techsolutions.com',
          phone: '0912345678',
          website: 'https://www.techsolutions.com',
          contactPerson: 'Phạm Văn D',
          contactTitle: 'Giám đốc',
          contactEmail: 'pham.van.d@techsolutions.com',
          contactPhone: '0987654321',
          description: 'Chúng tôi chuyên cung cấp giải pháp công nghệ thông tin cho doanh nghiệp vừa và nhỏ. Mong muốn hợp tác để mở rộng thị trường.',
          requestDate: '01/05/2025',
          documents: [
            { name: 'Giấy phép kinh doanh.pdf' },
            { name: 'Hồ sơ năng lực.pdf' }
          ]
        },
        {
          id: 'R002',
          companyName: 'Công ty CP Green Farm',
          businessType: 'Công ty Cổ phần',
          taxCode: '9876543210',
          address: 'Số 456, Đường Nguyễn Văn Linh, Quận 7, TP.HCM',
          email: 'contact@greenfarm.com',
          phone: '0923456789',
          website: 'https://www.greenfarm.com',
          contactPerson: 'Hoàng Thị E',
          contactTitle: 'Giám đốc Marketing',
          contactEmail: 'hoang.thi.e@greenfarm.com',
          contactPhone: '0912345987',
          description: 'Công ty chúng tôi chuyên sản xuất và phân phối các sản phẩm nông nghiệp sạch. Mong muốn trở thành đối tác để mở rộng kênh phân phối.',
          requestDate: '03/05/2025',
          documents: [
            { name: 'Giấy phép kinh doanh.pdf' },
            { name: 'Chứng nhận sản phẩm.pdf' }
          ]
        }
      ],
      
      // Account management
      accounts: [
        {
          id: 'A001',
          username: 'abc_admin',
          partnerName: 'Công ty TNHH ABC',
          email: 'admin@abc.com',
          createdAt: '01/03/2025',
          lastLogin: '06/05/2025 08:30',
          status: 'active'
        },
        {
          id: 'A002',
          username: 'xyz_admin',
          partnerName: 'Công ty CP XYZ',
          email: 'admin@xyz.com',
          createdAt: '15/03/2025',
          lastLogin: '05/05/2025 14:45',
          status: 'active'
        },
        {
          id: 'A003',
          username: 'def_admin',
          partnerName: 'Công ty TNHH DEF',
          email: 'admin@def.com',
          createdAt: '05/04/2025',
          lastLogin: '20/04/2025 10:15',
          status: 'inactive'
        }
      ],
      
      // Account search and filter
      accountSearch: '',
      accountStatusFilter: 'all',
      
      // Modals
      showPartnerModal: false,
      showRequestModal: false,
      showApprovePartnerModal: false,
      showRejectPartnerModal: false,
      showResetPasswordModal: false,
      showAddPartnerModal: false,
      
      // Selected items
      selectedPartner: null,
      selectedRequest: null,
      selectedAccount: null,
      
      // New partner approval
      newPartner: {
        name: '',
        account: {
          username: '',
          email: '',
          password: '',
          role: 'manager'
        },
        note: '',
        sendEmail: true
      },
      
      // Password management
      showPassword: false,
      showNewPassword: false,
      newPassword: '',
      requirePasswordChange: true,
      sendPasswordEmail: true,
      
      // Reject partner
      rejectReason: '',
      rejectNote: '',
      sendRejectionEmail: true,
      
      // Dashboard data
      recentActivities: [
        {
          time: '06/05/2025 09:15',
          content: 'Tài khoản abc_admin đã đăng nhập'
        },
        {
          time: '05/05/2025 16:30',
          content: 'Đã nhận yêu cầu đối tác mới từ Công ty CP Green Farm'
        },
        {
          time: '05/05/2025 14:45',
          content: 'Tài khoản xyz_admin đã đăng nhập'
        },
        {
          time: '04/05/2025 10:20',
          content: 'Đã nhận yêu cầu đối tác mới từ Công ty TNHH Tech Solutions'
        },
        {
          time: '03/05/2025 15:45',
          content: 'Đã cập nhật thông tin đối tác Công ty TNHH ABC'
        }
      ]
    };
  },
  computed: {
    // Get active partners count
    activePartners() {
      return this.partners.filter(partner => partner.status === 'active').length;
    },
    
    // Filter partners based on search and status
    filteredPartners() {
      let filtered = [...this.partners];
      
      if (this.partnerSearch) {
        const search = this.partnerSearch.toLowerCase();
        filtered = filtered.filter(partner => 
          partner.name.toLowerCase().includes(search) ||
          partner.email.toLowerCase().includes(search) ||
          partner.phone.includes(search) ||
          partner.id.toLowerCase().includes(search)
        );
      }
      
      if (this.partnerStatusFilter !== 'all') {
        filtered = filtered.filter(partner => partner.status === this.partnerStatusFilter);
      }
      
      // Pagination
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      
      return filtered.slice(start, end);
    },
    
    // Calculate total pages for pagination
    totalPages() {
      let filtered = [...this.partners];
      
      if (this.partnerSearch) {
        const search = this.partnerSearch.toLowerCase();
        filtered = filtered.filter(partner => 
          partner.name.toLowerCase().includes(search) ||
          partner.email.toLowerCase().includes(search) ||
          partner.phone.includes(search) ||
          partner.id.toLowerCase().includes(search)
        );
      }
      
      if (this.partnerStatusFilter !== 'all') {
        filtered = filtered.filter(partner => partner.status === this.partnerStatusFilter);
      }
      
      return Math.ceil(filtered.length / this.itemsPerPage) || 1;
    },
    
    // Filter accounts based on search and status
    filteredAccounts() {
      let filtered = [...this.accounts];
      
      if (this.accountSearch) {
        const search = this.accountSearch.toLowerCase();
        filtered = filtered.filter(account => 
          account.username.toLowerCase().includes(search) ||
          account.partnerName.toLowerCase().includes(search) ||
          account.email.toLowerCase().includes(search) ||
          account.id.toLowerCase().includes(search)
        );
      }
      
      if (this.accountStatusFilter !== 'all') {
        filtered = filtered.filter(account => account.status === this.accountStatusFilter);
      }
      
      return filtered;
    }
  },
  methods: {
    // Partner management
    viewPartnerDetails(partner) {
      this.selectedPartner = {...partner};
      this.showPartnerModal = true;
    },
    
    editPartner(partner) {
      // Implement partner editing functionality
      console.log('Editing partner:', partner);
    },
    
    togglePartnerStatus(partner) {
      const partnerIndex = this.partners.findIndex(p => p.id === partner.id);
      if (partnerIndex !== -1) {
        this.partners[partnerIndex].status = partner.status === 'active' ? 'inactive' : 'active';
      }
    },
    
    // Request management
    viewRequestDetails(request) {
      this.selectedRequest = {...request};
      this.showRequestModal = true;
    },
    
    showApproveModal(request) {
      this.selectedRequest = {...request};
      this.newPartner = {
        name: request.companyName,
        account: {
          username: this.generateUsername(request.companyName),
          email: request.email,
          password: this.generateRandomPassword(),
          role: 'manager'
        },
        note: '',
        sendEmail: true
      };
      this.showRequestModal = false;
      this.showApprovePartnerModal = true;
    },
    
    showRejectModal(request) {
      this.selectedRequest = {...request};
      this.rejectReason = '';
      this.rejectNote = '';
      this.sendRejectionEmail = true;
      this.showRequestModal = false;
      this.showRejectPartnerModal = true;
    },
    
    approvePartner() {
      // Create new partner
      const newPartnerId = 'P' + (this.partners.length + 1).toString().padStart(3, '0');
      const partner = {
        id: newPartnerId,
        name: this.newPartner.name || this.selectedRequest.companyName,
        email: this.selectedRequest.email,
        phone: this.selectedRequest.phone,
        address: this.selectedRequest.address,
        joinDate: new Date().toLocaleDateString('vi-VN'),
        status: 'active',
        businessType: this.selectedRequest.businessType,
        taxCode: this.selectedRequest.taxCode,
        website: this.selectedRequest.website,
        representative: this.selectedRequest.contactPerson,
        representativeTitle: this.selectedRequest.contactTitle,
        representativeEmail: this.selectedRequest.contactEmail,
        representativePhone: this.selectedRequest.contactPhone
      };
      
      // Create account
      const newAccountId = 'A' + (this.accounts.length + 1).toString().padStart(3, '0');
      const account = {
        id: newAccountId,
        username: this.newPartner.account.username,
        partnerName: partner.name,
        email: this.newPartner.account.email || this.selectedRequest.email,
        createdAt: new Date().toLocaleDateString('vi-VN'),
        lastLogin: '-',
        status: 'active'
      };
      
      // Add to data
      this.partners.push(partner);
      this.accounts.push(account);
      
      // Remove from pending requests
      const requestIndex = this.pendingRequests.findIndex(req => req.id === this.selectedRequest.id);
      if (requestIndex !== -1) {
        this.pendingRequests.splice(requestIndex, 1);
      }
      
      // Add activity
      this.recentActivities.unshift({
        time: new Date().toLocaleString('vi-VN'),
        content: `Đã duyệt đối tác mới: ${partner.name}`
      });
      
      // Close modal
      this.showApprovePartnerModal = false;
      
      // Show success message
      alert(`Đã duyệt đối tác ${partner.name} và tạo tài khoản thành công!`);
    },
    
    rejectPartner() {
      // Remove from pending requests
      const requestIndex = this.pendingRequests.findIndex(req => req.id === this.selectedRequest.id);
      if (requestIndex !== -1) {
        this.pendingRequests.splice(requestIndex, 1);
      }
      
      // Add activity
      this.recentActivities.unshift({
        time: new Date().toLocaleString('vi-VN'),
        content: `Đã từ chối yêu cầu đối tác: ${this.selectedRequest.companyName}`
      });
      
      // Close modal
      this.showRejectPartnerModal = false;
      
      // Show success message
      alert(`Đã từ chối yêu cầu đối tác ${this.selectedRequest.companyName}!`);
    },
    
    // Account management
    showResetPasswordModal(account) {
      this.selectedAccount = {...account};
      this.newPassword = this.generateRandomPassword();
      this.requirePasswordChange = true;
      this.sendPasswordEmail = true;
      this.showResetPasswordModal = true;
    },
    
    closeResetPasswordModal() {
      this.showResetPasswordModal = false;
      this.selectedAccount = null;
      this.newPassword = '';
    },
    
    resetPassword() {
      // In a real app, this would call an API to reset the password
      alert(`Đã đặt lại mật khẩu cho tài khoản ${this.selectedAccount.username}!`);
      
      // Add activity
      this.recentActivities.unshift({
        time: new Date().toLocaleString('vi-VN'),
        content: `Đã đặt lại mật khẩu cho tài khoản: ${this.selectedAccount.username}`
      });
      
      this.closeResetPasswordModal();
    },
    
    toggleAccountStatus(account) {
      const accountIndex = this.accounts.findIndex(a => a.id === account.id);
      if (accountIndex !== -1) {
        this.accounts[accountIndex].status = account.status === 'active' ? 'inactive' : 'active';
      }
    },
    
    // Helper methods
    generateUsername(companyName) {
      // Create a username from company name
      return companyName
        .toLowerCase()
        .replace(/công ty (tnhh|cp|cổ phần)\s+/i, '')
        .replace(/[^a-z0-9]/gi, '_')
        .replace(/_+/g, '_')
        .substring(0, 15) + '_admin';
    },
    
    generateRandomPassword() {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
      let password = '';
      for (let i = 0; i < 10; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return password;
    },
    
    generatePassword() {
      this.newPartner.account.password = this.generateRandomPassword();
      this.showPassword = true;
    },
    
    generateNewPassword() {
      this.newPassword = this.generateRandomPassword();
      this.showNewPassword = true;
    },
    
    logout() {
      // Implement logout functionality
      alert('Đăng xuất thành công!');
    }
  }
};
</script>

<style scoped>
.partner-management {
  font-family: 'Roboto', sans-serif;
  color: #333;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.header {
  background-color: #fff;
  padding: 1rem 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header h1 {
  margin: 0;
  font-size: 1.5rem;
  color: #1a56db;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.btn-logout {
  background-color: transparent;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-logout:hover {
  background-color: #f1f5f9;
}


.menu-container {
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: #fff;
  padding: 5px 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-top: 3px solid #2c2c54;
}

.menu-item {
  font-size: 16px;
  font-weight: 500;
  color: #4a4a4a;
  cursor: pointer;
  padding: 10px 20px;
  position: relative;
  transition: color 0.3s ease;
}

.menu-item::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  width: 100%;
  background-color: #e91e63;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
  border-radius: 2px;
}

.menu-item:hover::after,
.menu-item.active::after {
  transform: scaleX(1);
}

.menu-item:hover,
.menu-item.active {
  color: #e91e63;
  font-weight: bold;
}


  .badge {
    background-color: red;
    color: white;
    font-size: 12px;
    padding: 2px 6px;
    border-radius: 12px;
    margin-left: 5px;
  }

  i {
    font-size: 18px;
  }

.badge {
  position: absolute;
  right: 1.5rem;
  background-color: #ef4444;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
}

.content {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
}

/* Dashboard styles */
.stats {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background-color: #fff;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.stat-value {
  font-size: 2.5rem;
  font-weight: bold;
  color: #1a56db;
  margin-bottom: 0.5rem;
}

.stat-label {
  color: #64748b;
  font-size: 0.9rem;
}

.recent-activities {
  background-color: #fff;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.activities-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.activities-list li {
  padding: 0.8rem 0;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
}

.activities-list li:last-child {
  border-bottom: none;
}

.activity-time {
  color: #64748b;
  font-size: 0.85rem;
  width: 150px;
}

.activity-content {
  flex: 1;
}

/* Section headers */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

h2 {
  margin: 0;
  color: #334155;
}

/* Filter bar */
.filter-bar {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.search {
  flex: 1;
}

.search input {
  width: 100%;
  padding: 0.5rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
}

.filter select {
  padding: 0.5rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  min-width: 180px;
}

/* Data table */
.data-table {
  width: 100%;
  border-collapse: collapse;
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.data-table th,
.data-table td {
  padding: 0.75rem 1rem;
  text-align: left;
}

.data-table th {
  background-color: #f8fafc;
  font-weight: 600;
  color: #64748b;
}

.data-table tr {
  border-bottom: 1px solid #e2e8f0;
}

.data-table tr:last-child {
  border-bottom: none;
}

.status {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.85rem;
  display: inline-block;
}

.status.active {
  background-color: #dcfce7;
  color: #16a34a;
}

.status.inactive {
  background-color: #fee2e2;
  color: #dc2626;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.btn-view,
.btn-edit,
.btn-activate,
.btn-deactivate,
.btn-reset {
  background-color: transparent;
  border: none;
  width: 100px;
  height: 30px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #64748b;
}

.btn-view {
  background-color: #e0f2fe;
  color: #0284c7;
}

.btn-edit {
  background-color: #e0edff;
  color: #1a56db;
}

.btn-activate {
  background-color: #dcfce7;
  color: #16a34a;
}

.btn-deactivate {
  background-color: #fee2e2;
  color: #dc2626;
}

.btn-reset {
  background-color: #fef3c7;
  color: #d97706;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1.5rem;
  gap: 1rem;
}

.pagination button {
  background-color: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  padding: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* No data state */
.no-data {
  text-align: center;
  padding: 2rem;
  color: #64748b;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* Empty state */
.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: #64748b;
}

.empty-state i {
  font-size: 3rem;
  margin-bottom: 1rem;
}

/* Request cards */
.request-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.request-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.request-header {
  padding: 1rem;
  background-color: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.request-header h3 {
  margin: 0;
  font-size: 1.1rem;
}

.request-time {
  color: #64748b;
  font-size: 0.85rem;
}

.request-details {
  padding: 1rem;
}

.detail-row {
  display: flex;
  margin-bottom: 0.5rem;
}

.detail-row .label {
  width: 120px;
  color: #64748b;
  font-size: 0.9rem;
}

.request-actions {
  padding: 1rem;
  display: flex;
  gap: 0.5rem;
  border-top: 1px solid #e2e8f0;
}

/* Buttons */
.btn-primary {
  background-color: #1a56db;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary:hover {
  background-color: #1e429f;
}

.btn-secondary {
  background-color: #e2e8f0;
  color: #334155;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-secondary:hover {
  background-color: #cbd5e1;
}

.btn-danger {
  background-color: #dc2626;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-danger:hover {
  background-color: #b91c1c;
}
.btn-view {
  background-color: #245abd;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  flex: 1;
  height: auto;
  transition: all 0.3s;
}
.btn-approve {
  background-color: #16a34a;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  flex: 1;
  transition: all 0.3s;
}

.btn-approve:hover {
  background-color: #15803d;
}

.btn-reject {
  background-color: #dc2626;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  flex: 1;
  transition: all 0.3s;
}

.btn-reject:hover {
  background-color: #b91c1c;
}

/* Modal */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background-color: #fff;
  border-radius: 8px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-header {
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  background-color: #fff;
  z-index: 1;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.2rem;
}

.btn-close {
  background-color: transparent;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #64748b;
}

.modal-body {
  padding: 1.5rem;
}

.modal-footer {
  padding: 1rem;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  position: sticky;
  bottom: 0;
  background-color: #fff;
  z-index: 1;
}

/* Partner info */
.partner-info,
.request-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.info-section {
  margin-bottom: 1.5rem;
}

.info-section h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: #334155;
  font-size: 1.1rem;
}

.info-row {
  margin-bottom: 0.5rem;
  display: flex;
}
</style>