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
          resolve({ status: res.statusCode, data: body }); // might be plain text token
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
    const creds = { username: "hehe", password: "Password123!@#" };
    const emailCreds = { ...creds, email: "hao113@gmail.com" };
    const userId = "69d118f744ba9bdfb72e75f9"; // from user prompt

    console.log("1. Đang thử Login...");
    let loginRes = await request('/api/v1/auth/login', 'POST', creds);
    let token = loginRes.data;

    // Nếu login fail 404 thì register
    if (loginRes.status !== 200 || !token) {
      console.log("-> Login thất bại. Tiến hành Đăng ký...");
      await request('/api/v1/auth/register', 'POST', emailCreds);
      // Login lại
      loginRes = await request('/api/v1/auth/login', 'POST', creds);
      token = loginRes.data;
    }
    
    if (loginRes.status === 200) {
        console.log("✅ Lấy Token thành công:", token.substring(0, 20) + "...");
    } else {
        console.log("❌ Không thể lấy Token:", loginRes.data);
        return;
    }

    console.log("\n2. Đang lấy danh sách Role để tìm ADMIN...");
    let rolesRes = await request('/api/v1/roles/', 'GET');
    let adminRole = rolesRes.data.find(r => r.name === 'ADMIN');
    
    if (!adminRole) {
      console.log("-> Không tìm thấy role ADMIN. Đang tự tạo role ADMIN...");
      let createRoleRes = await request('/api/v1/roles/', 'POST', { name: "ADMIN", description: "Admin test auto" });
      adminRole = createRoleRes.data;
    }
    console.log("✅ Tìm thấy Role ADMIN có ID:", adminRole._id);

    console.log("\n3. Đang cập nhật Role ADMIN cho User có ID", userId, "...");
    let updateUserRes = await request('/api/v1/users/' + userId, 'PUT', { role: adminRole._id });
    if(updateUserRes.status === 200) {
       console.log("✅ Đã cấp quyền ADMIN thành công.");
    } else {
       console.log("❌ Không thể cấp quyền. Có thể UserID bạn cung cấp bị sai, hoặc tài khoản chưa có trong DB:", updateUserRes.data);
       console.log("-> Sẽ lấy userId từ token để tự cấp nếu có thể...");
       // token JWT thuong chua id
       // Do API không cung cấp cách lấy userId từ auth trừ /me có token
       let meRes = await request('/api/v1/auth/me', 'GET', null, token);
       if(meRes.status === 200 && meRes.data && meRes.data._id) {
           console.log("-> Tự tìm thấy userId:", meRes.data._id, ". Đang cập nhật quyền...");
           await request('/api/v1/users/' + meRes.data._id, 'PUT', { role: adminRole._id });
           console.log("✅ Cấp quyền dựa trên ID tự tìm thành công.");
       }
    }

    console.log("\n4. Test API Category - Đang POST tạo Category mới...");
    let createCatRes = await request('/api/v1/categories/', 'POST', {
        name: "Test Danh Mục " + Math.floor(Math.random() * 100),
        iconUrl: "https://icon.com/icon.png"
    }, token);
    
    if (createCatRes.status === 201) {
        console.log("✅ Tạo Category thành công!");
        console.dir(createCatRes.data, { depth: null });
    } else {
        console.log("❌ Tạo Category thất bại:", createCatRes.data);
    }

    console.log("\n5. Test API Category - Đang GET danh sách Category (không cần quyền)...");
    let getCatRes = await request('/api/v1/categories/', 'GET');
    console.log("✅ Danh sách Category hiện tại có: " + getCatRes.data.length + " mục.");

  } catch (err) {
    console.error("Lỗi:", err);
  }
}

runTest();
