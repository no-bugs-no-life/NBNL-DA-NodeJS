const http = require('http');

function request(path, method, data = null, token = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    if (token) options.headers['Authorization'] = 'Bearer ' + token;
    
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk.toString());
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: body ? JSON.parse(body) : null });
        } catch(e) {
          resolve({ status: res.statusCode, data: body }); // plain text fallback
        }
      });
    });
    
    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function runTest() {
  try {
    const creds = { username: "hehe2", password: "Password123!@#" };
    const emailCreds = { ...creds, email: "hao113_2@gmail.com" };

    // 1. LOGIN
    console.log("1. Đang Login...");
    let loginRes = await request('/api/v1/auth/login', 'POST', creds);
    let token = loginRes.data;

    if (loginRes.status !== 200 || !token) {
        console.log("-> Login thất bại. Database có thể trống. Tiến hành Đăng ký lại...");
        await request('/api/v1/auth/register', 'POST', emailCreds);
        loginRes = await request('/api/v1/auth/login', 'POST', creds);
        token = loginRes.data;
    }
    
    if (loginRes.status !== 200 || !token) {
        console.log("❌ Quá trình Login/Reg thất bại:", loginRes.data);
        return;
    }
    console.log("✅ Login thành công, đã lấy được Token.");

    let meRes = await request('/api/v1/auth/me', 'GET', null, token);
    const userId = meRes.data._id;

    // 2. TẠO HÀNG MỚI (CREATE APP)
    console.log("\n2. Thêm mặt hàng mới (Tạo App)...");
    let createAppRes = await request('/api/v1/apps/', 'POST', {
        name: "Sản phẩm test " + Math.floor(Math.random() * 1000),
        description: "App tuyệt vời",
        developerId: userId,
        price: 99
    }, token);

    if (createAppRes.status !== 201) {
        console.log("❌ Không thể tạo App/Sản phẩm mới:", createAppRes.data);
        return;
    }
    const newApp = createAppRes.data;
    console.log("✅ Tạo mặt hàng mới thành công. App ID:", newApp._id);

    // 2.1 TRONG TRƯỜNG HỢP APP CẦN PHÊ DUYỆT (Approve) MỚI MUA ĐƯỢC
    console.log("\n[Phụ] Kiểm duyệt App thành Published (vì bạn đang có quyền ADMIN)...");
    await request('/api/v1/apps/approve/' + newApp._id, 'POST', null, token);
    await request('/api/v1/apps/publish/' + newApp._id, 'POST', null, token);

    // 3. THÊM SẢN PHẨM VÀO GIỎ HÀNG (ADD TO CART)
    console.log("\n3. Thêm mặt hàng vừa tạo vào Giỏ Hàng (Cart)...");
    let addToCartRes = await request('/api/v1/carts/items', 'POST', {
        appId: newApp._id,
        itemType: 'one_time',
        quantity: 1
    }, token);

    if (addToCartRes.status === 201 || addToCartRes.status === 200) {
        console.log("✅ Thêm vào giỏ hàng THÀNH CÔNG.");
    } else {
        console.log("❌ Thêm giỏ hàng thất bại:", addToCartRes.data);
    }

    // 4. KIỂM TRA LẠI GIỎ HÀNG
    console.log("\n4. Trích xuất toàn bộ Giỏ hàng hiện tại...");
    let getCartRes = await request('/api/v1/carts/', 'GET', null, token);
    if (getCartRes.status === 200) {
        console.log("✅ Lấy Giỏ hàng thành công. Chi tiết:");
        console.dir(getCartRes.data, { depth: null });
    } else {
        console.log("❌ Không thể lấy giỏ hàng:", getCartRes.data);
    }

  } catch (err) {
    console.error("Lỗi kịch bản:", err);
  }
}

runTest();
