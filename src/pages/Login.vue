<template>
  <div id="app">
    <div class="login-container">
      <div class="logo-container">
        <div class="logo">
          <svg width="90" height="90" viewBox="0 0 90 90" xmlns="http://www.w3.org/2000/svg">
            <!-- Logistics Logo -->
            <defs>
              <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#0052cc" />
                <stop offset="100%" stop-color="#0066ff" />
              </linearGradient>
            </defs>
            <!-- Base Circle -->
            <circle cx="45" cy="45" r="40" fill="#f5f9ff" stroke="url(#logoGradient)" stroke-width="2.5" />
            <!-- Truck Outline -->
            <path d="M65,55 H60V35 H25V55 H20V35 C20,33.9 20.9,33 22,33 H58C59.1,33 60,33.9 60,35 V45 H65 L70,50 V55 H65Z" 
                  fill="url(#logoGradient)" stroke="#003d99" stroke-width="1.5" />
            <!-- Truck Cab -->
            <rect x="20" y="45" width="35" height="10" fill="#ffffff" stroke="#003d99" stroke-width="1.5" />
            <!-- Wheels -->
            <circle cx="30" cy="58" r="5" fill="#333333" stroke="#222222" stroke-width="1" />
            <circle cx="60" cy="58" r="5" fill="#333333" stroke="#222222" stroke-width="1" />
            <circle cx="30" cy="58" r="2" fill="#555555" />
            <circle cx="60" cy="58" r="2" fill="#555555" />
            <!-- Logistics Lines -->
            <line x1="25" y1="40" x2="40" y2="40" stroke="#003d99" stroke-width="2" stroke-linecap="round" />
            <line x1="25" y1="37" x2="45" y2="37" stroke="#003d99" stroke-width="2" stroke-linecap="round" />
            <line x1="25" y1="43" x2="35" y2="43" stroke="#003d99" stroke-width="2" stroke-linecap="round" />
            <!-- Parcel -->
            <rect x="40" y="47" width="10" height="6" fill="#f0f7ff" stroke="#003d99" stroke-width="1" />
            <!-- Shipping Routes (dotted path) -->
            <path d="M15,23 C25,15 40,20 50,15 C60,10 75,15 75,30" fill="none" stroke="#0066cc" stroke-width="1.5" stroke-dasharray="3,3" />
          </svg>
        </div>
      </div>
      
      <div class="login-header">
        <h1>{{ title }}</h1>
        <p>Vui lòng đăng nhập để tiếp tục</p>
      </div>

      <form @submit.prevent="onSubmit">
        <div class="form-group">
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            v-model="email"
            @blur="validateEmail"
            :class="{ error: emailError }"
            placeholder="example@domain.com"
            required
          />
          <p v-if="emailError" class="error-text">{{ emailError }}</p>
        </div>

        <div class="form-group">
          <label for="password">Mật khẩu</label>
          <input
            :type="showPassword ? 'text' : 'password'"
            id="password"
            v-model="password"
            @blur="validatePassword"
            :class="{ error: passwordError }"
            placeholder="Nhập mật khẩu của bạn"
            required
          />
          <p v-if="passwordError" class="error-text">{{ passwordError }}</p>
        </div>

        <div class="form-group checkbox-group">
          <input type="checkbox" id="showPassword" v-model="showPassword" />
          <label for="showPassword">
            <span class="checkbox-custom"></span>
            Hiển thị mật khẩu
          </label>
        </div>

        <div class="form-group checkbox-group">
          <input type="checkbox" id="rememberMe" v-model="rememberMe" /> 
          <label for="rememberMe">
            <span class="checkbox-custom"></span>
            Ghi nhớ đăng nhập
          </label>
        </div>

        <div class="form-footer">
          <button type="submit" class="btn-primary" :disabled="isLoading">
            {{ isLoading ? "Đang xử lý..." : "Đăng nhập" }}
          </button>

          <div class="forgot-password">
            <a href="#">Quên mật khẩu?</a>
          </div>

          <div class="register-link">
            Chưa có tài khoản? <a href="#">Đăng ký ngay</a>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: "Đăng nhập",
      email: "",
      password: "",
      emailError: "",
      passwordError: "",
      showPassword: false,
      rememberMe: false,
      isLoading: false,
    };
  },
  methods: {
    validateEmail() {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!this.email) {
        this.emailError = "Email không được để trống";
      } else if (!emailRegex.test(this.email)) {
        this.emailError = "Email không hợp lệ";
      } else {
        this.emailError = "";
      }
    },
    validatePassword() {
      if (!this.password) {
        this.passwordError = "Mật khẩu không được để trống";
      } else if (this.password.length < 6) {
        this.passwordError = "Mật khẩu phải có ít nhất 6 ký tự";
      } else {
        this.passwordError = "";
      }
    },
    onSubmit() {
      // Kiểm tra dữ liệu đầu vào
      this.validateEmail();
      this.validatePassword();

      if (!this.emailError && !this.passwordError) {
        this.isLoading = true;

        // Giả lập API call đăng nhập
        setTimeout(() => {
          try {
            console.log("Đăng nhập với:", {
              email: this.email,
              password: this.password,
              rememberMe: this.rememberMe,
            });

            // Lưu thông tin đăng nhập nếu cần (ví dụ: token)
            if (this.rememberMe) {
              localStorage.setItem('auth_token', 'example_token_here');
              localStorage.setItem('user_email', this.email);
            }

            // Đặt lại trạng thái loading
            this.isLoading = false;

            // Thông báo đăng nhập thành công
            alert('Đăng nhập thành công!');

            // Điều hướng đến trang dashboard
            this.$router.push('/DashboardLayout');

          } catch (error) {
            // Xử lý lỗi nếu có
            console.error("Lỗi đăng nhập:", error);
            this.isLoading = false;
            alert('Đăng nhập thất bại. Vui lòng thử lại.');
          }
        }, 1000);
      } else {
        // Nếu có lỗi, không cho phép đăng nhập
        alert('Vui lòng kiểm tra lại email và mật khẩu.');
      }
    },
  },
};
</script>

<style scoped>
/* Giữ nguyên phần style của bạn */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: 'Poppins', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

@keyframes gradientAnimation {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* Thêm ảnh nền thông qua cách gắn class cho #app */
#app {
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.65));
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  position: relative;
}

#app::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #0033a0, #1a73e8, #00509d, #0066b2);
  background-size: 400% 400%;
  opacity: 0.6;
  animation: gradientAnimation 15s ease infinite;
  z-index: 0;
}

.login-container {
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25), 
              0 1px 3px rgba(0, 0, 0, 0.1),
              0 0 60px rgba(0, 102, 255, 0.2);
  width: 100%;
  max-width: 450px;
  padding: 35px;
  position: relative;
  backdrop-filter: blur(10px);
  transform: translateY(0);
  transition: transform 0.4s ease, box-shadow 0.4s ease;
  overflow: hidden;
  z-index: 1;
}

.login-container:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3), 
              0 3px 10px rgba(0, 0, 0, 0.2),
              0 0 80px rgba(0, 102, 255, 0.3);
}

.login-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 5px;
  background: linear-gradient(90deg, #0066ff, #00ccff, #0066ff);
  background-size: 200% 200%;
  animation: gradientAnimation 3s linear infinite;
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-header h1 {
  color: #003366;
  font-size: 30px;
  font-weight: 700;
  margin-bottom: 10px;
  letter-spacing: 0.5px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.login-header p {
  color: #555;
  font-size: 15px;
  font-weight: 400;
}

.form-group {
  margin-bottom: 24px;
  position: relative;
}

label {
  display: block;
  margin-bottom: 8px;
  color: #444;
  font-weight: 500;
  font-size: 15px;
  transition: all 0.3s;
}

input {
  width: 100%;
  padding: 14px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 15px;
  transition: all 0.3s ease;
  background-color: rgba(250, 250, 250, 0.8);
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05);
}

input:focus {
  outline: none;
  border-color: #0066cc;
  box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.15);
  background-color: #fff;
}

input.error {
  border-color: #e53935;
  box-shadow: 0 0 0 3px rgba(229, 57, 53, 0.1);
}

.error-text {
  color: #e53935;
  font-size: 13px;
  margin-top: 6px;
  font-weight: 500;
  display: flex;
  align-items: center;
  opacity: 1;
  transform: translateY(0);
  transition: all 0.3s ease;
}

.form-footer {
  margin-top: 35px;
}

.btn-primary {
  width: 100%;
  background: linear-gradient(45deg, #0052cc, #0066ff);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 14px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(0, 102, 255, 0.25);
  position: relative;
  overflow: hidden;
  z-index: 1;
}

.btn-primary::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, #003d99, #0052cc);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: -1;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(0, 102, 255, 0.35);
}

.btn-primary:hover::before {
  opacity: 1;
}

.btn-primary:active {
  transform: translateY(1px);
  box-shadow: 0 2px 8px rgba(0, 102, 255, 0.25);
}

.btn-primary:disabled {
  background: linear-gradient(45deg, #88b0e8, #99c2ff);
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}

.forgot-password {
  text-align: center;
  margin-top: 20px;
}

.forgot-password a {
  color: #0066cc;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.forgot-password a:hover {
  color: #004d99;
  text-decoration: underline;
}

.register-link {
  text-align: center;
  margin-top: 25px;
  font-size: 14px;
  color: #555;
  padding-top: 20px;
  border-top: 1px solid #eaeaea;
}

.register-link a {
  color: #0066cc;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
}

.register-link a:hover {
  color: #004d99;
  text-decoration: underline;
}

.logo-container {
  text-align: center;
  margin-bottom: 25px;
  position: relative;
}

.logo {
  width: 120px;
  height: 120px;
  margin: 0 auto;
  background: linear-gradient(135deg, #ffffff, #f0f7ff);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1),
              0 0 0 8px rgba(255, 255, 255, 0.15),
              0 0 0 16px rgba(255, 255, 255, 0.05);
  position: relative;
  z-index: 1;
  overflow: hidden;
  transition: all 0.5s ease;
}

.logo:hover {
  transform: scale(1.05);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15),
              0 0 0 10px rgba(255, 255, 255, 0.2),
              0 0 0 20px rgba(255, 255, 255, 0.08);
}

.logo::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    rgba(255, 255, 255, 0.3),
    rgba(255, 255, 255, 0.05)
  );
  transform: rotate(30deg);
  z-index: -1;
}

.checkbox-group {
  display: flex;
  align-items: center;
}

.checkbox-group input[type="checkbox"] {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkbox-group label {
  position: relative;
  padding-left: 30px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  user-select: none;
  font-weight: normal;
  margin: 0;
  font-size: 14px;
  color: #555;
}

.checkbox-custom {
  position: absolute;
  top: 0;
  left: 0;
  height: 20px;
  width: 20px;
  background-color: #f5f5f5;
  border: 2px solid #ddd;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.checkbox-group:hover input ~ .checkbox-custom {
  background-color: #eaeaea;
  border-color: #ccc;
}

.checkbox-group input:checked ~ .checkbox-custom {
  background-color: #0066cc;
  border-color: #0066cc;
}

.checkbox-custom:after {
  content: "";
  position: absolute;
  display: none;
  left: 6px;
  top: 2px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.checkbox-group input:checked ~ .checkbox-custom:after {
  display: block;
}

@media (max-width: 576px) {
  .login-container {
    max-width: 90%;
    padding: 25px;
  }
  
  .logo {
    width: 100px;
    height: 100px;
  }
}
</style>