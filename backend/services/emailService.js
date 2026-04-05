let { Resend } = require('resend');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.FROM_EMAIL || 'NBNL Store <onboarding@resend.dev>';

/**
 * Send an email via Resend.
 * @param {Object} options
 * @param {string} options.to      - Recipient email address
 * @param {string} options.subject  - Email subject
 * @param {string} [options.html]  - HTML body
 * @param {string} [options.text]   - Plain text body
 */
async function sendEmail({ to, subject, html, text }) {
    try {
        const { data, error } = await resend.emails.send({
            from: FROM_EMAIL,
            to: [to],
            subject,
            html: html || '',
            text: text || '',
        });

        if (error) {
            console.error('[EmailService] Resend error:', error);
            return { success: false, error };
        }

        console.log('[EmailService] Email sent:', data?.id);
        return { success: true, data };
    } catch (err) {
        console.error('[EmailService] Exception:', err.message);
        return { success: false, error: err.message };
    }
}

/**
 * Send notification email to a user.
 * Auto-generates a styled HTML template.
 */
async function sendNotificationEmail({ toEmail, userName, type, message }) {
    const TYPE_SUBJECTS = {
        app_approved:  '🎉 Ứng dụng của bạn đã được duyệt!',
        app_rejected:  '❌ Ứng dụng của bạn bị từ chị thông báo',
        new_review:    '⭐ Bạn có đánh giá mới',
        new_download:  '📥 Ứng dụng của bạn được tải mới',
        system:        '🔔 Thông báo từ hệ thống',
        promotion:     '🎁 Khuyến mãi hấp dẫn dành cho bạn!',
        update:        '🛠️ Cập nhật mới từ NBNL Store',
    };

    const subject = TYPE_SUBJECTS[type] || '📢 Thông báo từ NBNL Store';
    const html = buildNotificationHtml({ userName, type, message });

    return sendEmail({ to: toEmail, subject, html });
}

function buildNotificationHtml({ userName, type, message }) {
    const TYPE_COLORS = {
        app_approved:  '#16a34a',
        app_rejected:  '#dc2626',
        new_review:    '#2563eb',
        new_download:  '#7c3aed',
        system:        '#475569',
        promotion:     '#d97706',
        update:        '#0891b2',
    };
    const color = TYPE_COLORS[type] || '#475569';

    return `
<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Thong bao NBNL Store</title>
</head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:Segoe UI,Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
          <!-- Header -->
          <tr>
            <td style="background:#1e293b;border-radius:16px 16px 0 0;padding:32px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;">NBNL Store</h1>
              <p style="margin:6px 0 0;color:#94a3b8;font-size:13px;">Thong bao tu he thong</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="background:#ffffff;padding:40px;">
              <p style="margin:0 0 8px;color:#64748b;font-size:14px;">Xin chao,</p>
              <h2 style="margin:0 0 20px;color:#0f172a;font-size:18px;font-weight:700;">
                ${escapeHtml(userName || 'Ban')}
              </h2>
              <div style="border-left:4px solid ${color};padding-left:16px;margin-bottom:24px;">
                <p style="margin:0;color:#334155;font-size:15px;line-height:1.7;">${escapeHtml(message)}</p>
              </div>
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}"
                 style="display:inline-block;background:${color};color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:12px 28px;border-radius:10px;">
                Xem chi tiet
              </a>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#f1f5f9;border-radius:0 0 16px 16px;padding:24px 40px;text-align:center;">
              <p style="margin:0;color:#94a3b8;font-size:12px;">
                Neu ban khong muon nhan email nay, vui long bo qua.<br/>
                &copy; ${new Date().getFullYear()} NBNL Store. Tat ca quyen duoc bao luu.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

module.exports = { sendEmail, sendNotificationEmail };
