// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500
};

// Error Codes
export const ERROR_CODES = {
  // Authentication Errors (1000-1999)
  AUTH_INVALID_CREDENTIALS: 1000,
  AUTH_TOKEN_EXPIRED: 1001,
  AUTH_TOKEN_INVALID: 1002,
  AUTH_TOKEN_MISSING: 1003,
  AUTH_INSUFFICIENT_PERMISSIONS: 1004,
  AUTH_ACCOUNT_DISABLED: 1005,
  AUTH_ACCOUNT_LOCKED: 1006,

  // Validation Errors (2000-2999)
  VALIDATION_REQUIRED_FIELD: 2000,
  VALIDATION_INVALID_EMAIL: 2001,
  VALIDATION_INVALID_PHONE: 2002,
  VALIDATION_INVALID_PASSWORD: 2003,
  VALIDATION_INVALID_DATE: 2004,
  VALIDATION_INVALID_NUMBER: 2005,
  VALIDATION_INVALID_RATING: 2006,
  VALIDATION_ERROR: 2007,

  // Resource Errors (3000-3999)
  RESOURCE_NOT_FOUND: 3000,
  RESOURCE_ALREADY_EXISTS: 3001,
  RESOURCE_DELETED: 3002,
  RESOURCE_IN_USE: 3003,

  // Business Logic Errors (4000-4999)
  BUSINESS_INVALID_OPERATION: 4000,
  BUSINESS_INSUFFICIENT_STOCK: 4001,
  BUSINESS_INVALID_ORDER_STATUS: 4002,
  BUSINESS_INVALID_VOUCHER: 4003,
  BUSINESS_INVALID_PAYMENT: 4004,
  BUSINESS_REVIEW_LIMIT_EXCEEDED: 4005,

  // Database Errors (5000-5999)
  DB_CONNECTION_ERROR: 5000,
  DB_QUERY_ERROR: 5001,
  DB_DUPLICATE_KEY: 5002,
  DB_VALIDATION_ERROR: 5003,

  // External Service Errors (6000-6999)
  EXTERNAL_SERVICE_ERROR: 6000,
  EXTERNAL_SERVICE_TIMEOUT: 6001,
  EXTERNAL_SERVICE_UNAVAILABLE: 6002,
  
  // Configuration Errors (7000-7999)
  CONFIGURATION_ERROR: 7000
};

// Error Messages
export const ERROR_MESSAGES = {
  // Authentication Messages
  [ERROR_CODES.AUTH_INVALID_CREDENTIALS]: 'Tên đăng nhập hoặc mật khẩu không chính xác',
  [ERROR_CODES.AUTH_TOKEN_EXPIRED]: 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại',
  [ERROR_CODES.AUTH_TOKEN_INVALID]: 'Phiên đăng nhập không hợp lệ, vui lòng đăng nhập lại',
  [ERROR_CODES.AUTH_TOKEN_MISSING]: 'Vui lòng đăng nhập để tiếp tục',
  [ERROR_CODES.AUTH_INSUFFICIENT_PERMISSIONS]: 'Bạn không có quyền thực hiện thao tác này',
  [ERROR_CODES.AUTH_ACCOUNT_DISABLED]: 'Tài khoản của bạn đã bị vô hiệu hóa',
  [ERROR_CODES.AUTH_ACCOUNT_LOCKED]: 'Tài khoản của bạn đã bị khóa do đăng nhập sai nhiều lần',

  // Validation Messages
  [ERROR_CODES.VALIDATION_REQUIRED_FIELD]: 'Vui lòng điền đầy đủ thông tin bắt buộc',
  [ERROR_CODES.VALIDATION_INVALID_EMAIL]: 'Email không đúng định dạng',
  [ERROR_CODES.VALIDATION_INVALID_PHONE]: 'Số điện thoại không đúng định dạng',
  [ERROR_CODES.VALIDATION_INVALID_PASSWORD]: 'Mật khẩu phải có ít nhất 6 ký tự',
  [ERROR_CODES.VALIDATION_INVALID_DATE]: 'Ngày tháng không đúng định dạng',
  [ERROR_CODES.VALIDATION_INVALID_NUMBER]: 'Giá trị số không hợp lệ',
  [ERROR_CODES.VALIDATION_INVALID_RATING]: 'Đánh giá phải từ 1 đến 5 sao',
  [ERROR_CODES.VALIDATION_ERROR]: 'Dữ liệu đầu vào không hợp lệ',

  // Resource Messages
  [ERROR_CODES.RESOURCE_NOT_FOUND]: 'Không tìm thấy thông tin yêu cầu',
  [ERROR_CODES.RESOURCE_ALREADY_EXISTS]: 'Thông tin này đã tồn tại trong hệ thống',
  [ERROR_CODES.RESOURCE_DELETED]: 'Thông tin này đã bị xóa',
  [ERROR_CODES.RESOURCE_IN_USE]: 'Không thể xóa vì thông tin này đang được sử dụng',

  // Business Logic Messages
  [ERROR_CODES.BUSINESS_INVALID_OPERATION]: 'Thao tác không hợp lệ',
  [ERROR_CODES.BUSINESS_INSUFFICIENT_STOCK]: 'Số lượng sản phẩm trong kho không đủ',
  [ERROR_CODES.BUSINESS_INVALID_ORDER_STATUS]: 'Trạng thái đơn hàng không hợp lệ',
  [ERROR_CODES.BUSINESS_INVALID_VOUCHER]: 'Mã giảm giá không hợp lệ hoặc đã hết hạn',
  [ERROR_CODES.BUSINESS_INVALID_PAYMENT]: 'Thông tin thanh toán không hợp lệ',
  [ERROR_CODES.BUSINESS_REVIEW_LIMIT_EXCEEDED]: 'Bạn đã đánh giá sản phẩm này rồi',

  // Database Messages
  [ERROR_CODES.DB_CONNECTION_ERROR]: 'Lỗi kết nối cơ sở dữ liệu',
  [ERROR_CODES.DB_QUERY_ERROR]: 'Lỗi truy vấn dữ liệu',
  [ERROR_CODES.DB_DUPLICATE_KEY]: 'Thông tin này đã tồn tại trong hệ thống',
  [ERROR_CODES.DB_VALIDATION_ERROR]: 'Dữ liệu không hợp lệ',

  // External Service Messages
  [ERROR_CODES.EXTERNAL_SERVICE_ERROR]: 'Lỗi kết nối dịch vụ bên ngoài',
  [ERROR_CODES.EXTERNAL_SERVICE_TIMEOUT]: 'Dịch vụ bên ngoài không phản hồi',
  [ERROR_CODES.EXTERNAL_SERVICE_UNAVAILABLE]: 'Dịch vụ bên ngoài không khả dụng',
  [ERROR_CODES.CONFIGURATION_ERROR]: 'Lỗi cấu hình hệ thống'
};

// Error Descriptions
export const ERROR_DESCRIPTIONS = {
  // Authentication Descriptions
  [ERROR_CODES.AUTH_INVALID_CREDENTIALS]: 'Vui lòng kiểm tra lại tên đăng nhập và mật khẩu của bạn',
  [ERROR_CODES.AUTH_TOKEN_EXPIRED]: 'Phiên đăng nhập của bạn đã hết hạn, vui lòng đăng nhập lại để tiếp tục',
  [ERROR_CODES.AUTH_TOKEN_INVALID]: 'Phiên đăng nhập không hợp lệ, có thể do token bị thay đổi hoặc hết hạn',
  [ERROR_CODES.AUTH_TOKEN_MISSING]: 'Bạn cần đăng nhập để thực hiện thao tác này',
  [ERROR_CODES.AUTH_INSUFFICIENT_PERMISSIONS]: 'Tài khoản của bạn không có quyền thực hiện thao tác này. Vui lòng liên hệ admin nếu bạn cần quyền truy cập',
  [ERROR_CODES.AUTH_ACCOUNT_DISABLED]: 'Tài khoản của bạn đã bị vô hiệu hóa. Vui lòng liên hệ admin để được hỗ trợ',
  [ERROR_CODES.AUTH_ACCOUNT_LOCKED]: 'Tài khoản của bạn đã bị khóa do đăng nhập sai nhiều lần. Vui lòng thử lại sau 30 phút hoặc liên hệ admin',

  // Validation Descriptions
  [ERROR_CODES.VALIDATION_REQUIRED_FIELD]: 'Vui lòng kiểm tra và điền đầy đủ các thông tin bắt buộc được đánh dấu *',
  [ERROR_CODES.VALIDATION_INVALID_EMAIL]: 'Email phải có định dạng hợp lệ, ví dụ: example@domain.com',
  [ERROR_CODES.VALIDATION_INVALID_PHONE]: 'Số điện thoại phải có 10 số và bắt đầu bằng số 0',
  [ERROR_CODES.VALIDATION_INVALID_PASSWORD]: 'Mật khẩu phải có ít nhất 6 ký tự, bao gồm chữ và số',
  [ERROR_CODES.VALIDATION_INVALID_DATE]: 'Ngày tháng phải có định dạng DD/MM/YYYY',
  [ERROR_CODES.VALIDATION_INVALID_NUMBER]: 'Giá trị phải là số và lớn hơn 0',
  [ERROR_CODES.VALIDATION_INVALID_RATING]: 'Đánh giá phải từ 1 đến 5 sao, với 5 sao là cao nhất',
  [ERROR_CODES.VALIDATION_ERROR]: 'Dữ liệu đầu vào không hợp lệ. Vui lòng kiểm tra lại thông tin bạn đã nhập',

  // Resource Descriptions
  [ERROR_CODES.RESOURCE_NOT_FOUND]: 'Không tìm thấy thông tin bạn yêu cầu. Vui lòng kiểm tra lại ID hoặc thông tin tìm kiếm',
  [ERROR_CODES.RESOURCE_ALREADY_EXISTS]: 'Thông tin này đã tồn tại trong hệ thống. Vui lòng kiểm tra lại hoặc sử dụng thông tin khác',
  [ERROR_CODES.RESOURCE_DELETED]: 'Thông tin này đã bị xóa khỏi hệ thống. Vui lòng kiểm tra lại hoặc liên hệ admin',
  [ERROR_CODES.RESOURCE_IN_USE]: 'Không thể xóa thông tin này vì đang được sử dụng bởi các chức năng khác trong hệ thống',

  // Business Logic Descriptions
  [ERROR_CODES.BUSINESS_INVALID_OPERATION]: 'Thao tác bạn đang thực hiện không hợp lệ. Vui lòng kiểm tra lại các bước thực hiện',
  [ERROR_CODES.BUSINESS_INSUFFICIENT_STOCK]: 'Số lượng sản phẩm trong kho không đủ để đáp ứng yêu cầu của bạn. Vui lòng giảm số lượng hoặc chọn sản phẩm khác',
  [ERROR_CODES.BUSINESS_INVALID_ORDER_STATUS]: 'Không thể thay đổi trạng thái đơn hàng theo yêu cầu. Vui lòng kiểm tra lại quy trình xử lý đơn hàng',
  [ERROR_CODES.BUSINESS_INVALID_VOUCHER]: 'Mã giảm giá không hợp lệ hoặc đã hết hạn. Vui lòng kiểm tra lại mã hoặc chọn mã khác',
  [ERROR_CODES.BUSINESS_INVALID_PAYMENT]: 'Thông tin thanh toán không hợp lệ. Vui lòng kiểm tra lại thông tin thẻ hoặc phương thức thanh toán',
  [ERROR_CODES.BUSINESS_REVIEW_LIMIT_EXCEEDED]: 'Bạn đã đánh giá sản phẩm này rồi. Mỗi người chỉ được đánh giá một lần cho mỗi sản phẩm',

  // Database Descriptions
  [ERROR_CODES.DB_CONNECTION_ERROR]: 'Không thể kết nối đến cơ sở dữ liệu. Vui lòng thử lại sau hoặc liên hệ admin',
  [ERROR_CODES.DB_QUERY_ERROR]: 'Có lỗi xảy ra khi truy vấn dữ liệu. Vui lòng thử lại sau',
  [ERROR_CODES.DB_DUPLICATE_KEY]: 'Thông tin này đã tồn tại trong hệ thống. Vui lòng sử dụng thông tin khác',
  [ERROR_CODES.DB_VALIDATION_ERROR]: 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin nhập vào',

  // External Service Descriptions
  [ERROR_CODES.EXTERNAL_SERVICE_ERROR]: 'Không thể kết nối đến dịch vụ bên ngoài. Vui lòng thử lại sau',
  [ERROR_CODES.EXTERNAL_SERVICE_TIMEOUT]: 'Dịch vụ bên ngoài không phản hồi. Vui lòng thử lại sau',
  [ERROR_CODES.EXTERNAL_SERVICE_UNAVAILABLE]: 'Dịch vụ bên ngoài hiện không khả dụng. Vui lòng thử lại sau',
  [ERROR_CODES.CONFIGURATION_ERROR]: 'Hệ thống đang gặp lỗi cấu hình. Vui lòng liên hệ admin để được hỗ trợ'
};