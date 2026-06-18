// =====================================================
// Policy data — 4 static policy pages
// Centralized so content is editable in 1 place
// =====================================================

import type { PolicySection } from '@/components/shop';

export interface Policy {
  slug: string;
  title: string;
  description: string;
  lastUpdated: string;
  sections: PolicySection[];
}

export const POLICIES: Policy[] = [
  {
    slug: 'giao-hang',
    title: 'Chính sách giao hàng',
    description:
      'Quy định về phí vận chuyển, thời gian giao hàng, khu vực áp dụng và các trường hợp đặc biệt khi mua thuốc tại Long Châu.',
    lastUpdated: '01/06/2026',
    sections: [
      {
        id: 'khu-vuc',
        title: 'Khu vực giao hàng',
        body: (
          <>
            <p>Long Châu giao hàng trên toàn quốc với 3 vùng chính:</p>
            <ul>
              <li>
                <strong>Nội thành TP.HCM & Hà Nội:</strong> Giao trong 30 phút - 2 giờ, áp
                dụng cho đơn thuốc không kê đơn.
              </li>
              <li>
                <strong>Tỉnh thành có nhà thuốc Long Châu:</strong> Giao trong 4-8 giờ qua đội
                ngũ nhân viên nhà thuốc.
              </li>
              <li>
                <strong>Tỉnh vùng sâu vùng xa:</strong> Giao qua đơn vị vận chuyển (Viettel Post, GHTK),
                thời gian 2-4 ngày làm việc.
              </li>
            </ul>
          </>
        ),
      },
      {
        id: 'phi-van-chuyen',
        title: 'Phí vận chuyển',
        body: (
          <>
            <p>
              Phí vận chuyển được tính theo khu vực và giá trị đơn hàng. Miễn phí giao hàng cho
              đơn hàng từ <strong>300.000 VND</strong> trong nội thành hoặc{' '}
              <strong>500.000 VND</strong> cho các tỉnh khác.
            </p>
            <table>
              <thead>
                <tr>
                  <th>Khu vực</th>
                  <th>Đơn &lt; 300K</th>
                  <th>Đơn 300K-500K</th>
                  <th>Đơn ≥ 500K</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Nội thành HN/HCM</td>
                  <td>15.000đ</td>
                  <td>Miễn phí</td>
                  <td>Miễn phí</td>
                </tr>
                <tr>
                  <td>Tỉnh có nhà thuốc</td>
                  <td>25.000đ</td>
                  <td>15.000đ</td>
                  <td>Miễn phí</td>
                </tr>
                <tr>
                  <td>Vùng sâu vùng xa</td>
                  <td>35.000đ</td>
                  <td>25.000đ</td>
                  <td>15.000đ</td>
                </tr>
              </tbody>
            </table>
          </>
        ),
      },
      {
        id: 'thuoc-ke-don',
        title: 'Đặc biệt với thuốc kê đơn',
        body: (
          <>
            <p>
              Đơn hàng có thuốc kê đơn bắt buộc phải upload ảnh đơn thuốc và được dược sĩ xác
              nhận trước khi giao. Thời gian xử lý thêm 15-30 phút. Chúng tôi không giao
              thuốc kê đơn qua đơn vị vận chuyển bên thứ ba.
            </p>
          </>
        ),
      },
      {
        id: 'screenshot-thu-tien',
        title: 'Thu hộ tiền (COD)',
        body: (
          <p>
            Áp dụng cho đơn hàng dưới 5 triệu VND tại khu vực không hỗ trợ thanh toán online.
            Phí thu hộ: 0.5% giá trị đơn (tối thiểu 5.000đ). Đơn trên 5 triệu bắt buộc chuyển
            khoản ngân hàng.
          </p>
        ),
      },
      {
        id: 'lien-he',
        title: 'Liên hệ hỗ trợ',
        body: (
          <p>
            Hotline: <strong>1800 6928</strong> (Nhánh 1) hoặc email:{' '}
            <em>cskh@longchau.vn</em>. Thời gian hỗ trợ: 8:00 - 22:00 hằng ngày.
          </p>
        ),
      },
    ],
  },
  {
    slug: 'doi-tra',
    title: 'Chính sách đổi trả',
    description:
      'Điều kiện, thời hạn và quy trình đổi trả thuốc, thực phẩm chức năng, mỹ phẩm tại Long Châu.',
    lastUpdated: '15/05/2026',
    sections: [
      {
        id: 'thoi-han',
        title: 'Thời hạn đổi trả',
        body: (
          <p>
            Long Châu chấp nhận đổi trả trong vòng <strong>30 ngày</strong> kể từ ngày mua
            với điều kiện sản phẩm còn nguyên bao bì, tem mác và chưa qua sử dụng. Chỉ cần
            đọc SĐT hoặc giữ lại hóa đơn.
          </p>
        ),
      },
      {
        id: 'dieu-kien',
        title: 'Điều kiện đổi trả',
        body: (
          <ul>
            <li>Sản phẩm còn nguyên bao bì, chưa mở nắp, chưa sử dụng.</li>
            <li>Có hóa đơn mua hàng (điện tử hoặc giấy) trong vòng 30 ngày.</li>
            <li>Sản phẩm không nằm trong danh mục hạn chế đổi trả (xem bên dưới).</li>
            <li>Không có dấu hiệu bảo quản sai, hết hạn, biến chất.</li>
          </ul>
        ),
      },
      {
        id: 'danh-muc-han-che',
        title: 'Danh mục hạn chế đổi trả',
        body: (
          <ul>
            <li>
              <strong>Thuốc kê đơn:</strong> Theo quy định Bộ Y tế, thuốc kê đơn chỉ đổi trả
              khi có lỗi từ nhà sản xuất (sai hạn dùng, bao bì hỏng).
            </li>
            <li>
              <strong>Sản phẩm đã mở seal vô trùng:</strong> Bơm tiêm, kim tiêm, gạc y tế đã
              mở bao bì.
            </li>
            <li>
              <strong>Sản phẩm có hạn dùng còn dưới 30 ngày:</strong> Trừ khi lỗi từ nhà thuốc.
            </li>
            <li>
              <strong>Đơn thuốc đã sử dụng một phần:</strong> Vỉ thuốc đã bóc 1-2 viên.
            </li>
          </ul>
        ),
      },
      {
        id: 'quy-trinh',
        title: 'Quy trình đổi trả',
        body: (
          <ol>
            <li>
              <strong>Bước 1:</strong> Liên hệ hotline 1800 6928 hoặc đến trực tiếp nhà thuốc Long Châu gần nhất.
            </li>
            <li>
              <strong>Bước 2:</strong> Cung cấp SĐT / mã đơn hàng + lý do đổi trả + hình ảnh sản phẩm.
            </li>
            <li>
              <strong>Bước 3:</strong> Dược sĩ xác nhận điều kiện đổi trả trong 24 giờ.
            </li>
            <li>
              <strong>Bước 4:</strong> Hoàn tiền trong 3-5 ngày làm việc qua MoMo / chuyển khoản / tiền mặt tại nhà thuốc.
            </li>
          </ol>
        ),
      },
      {
        id: 'hoan-tien',
        title: 'Phương thức hoàn tiền',
        body: (
          <ul>
            <li>
              <strong>Ví MoMo / ZaloPay / VNPay:</strong> Hoàn trong vòng 24 giờ.
            </li>
            <li>
              <strong>Thẻ tín dụng / ghi nợ:</strong> 5-10 ngày làm việc tùy ngân hàng.
            </li>
            <li>
              <strong>COD / tiền mặt:</strong> Hoàn tiền mặt tại nhà thuốc hoặc chuyển khoản ngân hàng.
            </li>
          </ul>
        ),
      },
    ],
  },
  {
    slug: 'bao-mat',
    title: 'Chính sách bảo mật',
    description:
      'Cam kết của Long Châu về việc bảo vệ dữ liệu cá nhân, thông tin sức khỏe và quyền riêng tư của khách hàng.',
    lastUpdated: '20/04/2026',
    sections: [
      {
        id: 'thu-thap',
        title: 'Dữ liệu chúng tôi thu thập',
        body: (
          <ul>
            <li>Thông tin cá nhân: Họ tên, SĐT, email, ngày sinh, giới tính.</li>
            <li>Thông tin sức khỏe: Dị ứng thuốc, bệnh nền, lịch sử đơn thuốc (nếu bạn cung cấp).</li>
            <li>Dữ liệu giao dịch: Đơn hàng, thanh toán, lịch sử mua.</li>
            <li>Dữ liệu kỹ thuật: IP, browser, thiết bị (để cải thiện trải nghiệm).</li>
          </ul>
        ),
      },
      {
        id: 'muc-dich',
        title: 'Mục đích sử dụng',
        body: (
          <ul>
            <li>Xử lý đơn hàng, giao hàng, hỗ trợ sau bán.</li>
            <li>Tư vấn dược sĩ, cảnh báo tương tác thuốc, nhắc uống thuốc.</li>
            <li>Cải thiện dịch vụ, nghiên cứu thị trường (ẩn danh).</li>
            <li>Thông báo chương trình khuyến mãi (chỉ khi bạn đồng ý).</li>
          </ul>
        ),
      },
      {
        id: 'ai-consent',
        title: 'Xử lý AI & quyền đồng ý',
        body: (
          <p>
            Tính năng AI (chatbot tư vấn, OCR đơn thuốc, cảnh báo tương tác thuốc) yêu cầu{' '}
            <strong>đồng ý riêng</strong> từ bạn. Bạn có thể bật/tắt bất kỳ lúc nào trong{' '}
            <em>Cài đặt → Quyền riêng tư</em>. Khi tắt, AI sẽ không xử lý dữ liệu của bạn.
          </p>
        ),
      },
      {
        id: 'bao-ve',
        title: 'Bảo vệ dữ liệu',
        body: (
          <ul>
            <li>Mã hóa TLS 1.3 cho mọi giao tiếp.</li>
            <li>Mã hóa at-rest cho database (AES-256).</li>
            <li>Audit log mọi truy cập dữ liệu sức khỏe (BR-AI-01).</li>
            <li>2FA cho dược sĩ, IP whitelist cho admin tools.</li>
            <li>Tuân thủ Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân.</li>
          </ul>
        ),
      },
      {
        id: 'quyen-cua-ban',
        title: 'Quyền của bạn',
        body: (
          <ul>
            <li>Quyền truy cập: Tải xuống toàn bộ dữ liệu cá nhân.</li>
            <li>Quyền sửa: Cập nhật thông tin bất kỳ lúc nào.</li>
            <li>Quyền xoá: Yêu cầu xoá tài khoản và toàn bộ dữ liệu trong 30 ngày.</li>
            <li>Quyền hạn chế: Tắt AI, tắt marketing, tắt share với bên thứ ba.</li>
          </ul>
        ),
      },
      {
        id: 'lien-he',
        title: 'Liên hệ DPO',
        body: (
          <p>
            Data Protection Officer: <em>dpo@longchau.vn</em>. Hotline: 1800 6928 (Nhánh 4). Địa chỉ:
            379-381 Hai Bà Trưng, P. Xuân Hoà, TP. Hồ Chí Minh.
          </p>
        ),
      },
    ],
  },
  {
    slug: 'tos',
    title: 'Điều khoản sử dụng',
    description:
      'Quy định ràng buộc khi sử dụng website, ứng dụng và dịch vụ của FPT Long Châu.',
    lastUpdated: '10/01/2026',
    sections: [
      {
        id: 'chap-nhan',
        title: 'Chấp nhận điều khoản',
        body: (
          <p>
            Bằng việc truy cập và sử dụng website/ứng dụng Long Châu, bạn đồng ý tuân thủ các
            điều khoản dưới đây. Nếu không đồng ý, vui lòng ngừng sử dụng dịch vụ.
          </p>
        ),
      },
      {
        id: 'su-dung',
        title: 'Quy tắc sử dụng',
        body: (
          <ul>
            <li>Bạn phải từ 18 tuổi trở lên để mua thuốc không kê đơn.</li>
            <li>Thuốc kê đơn chỉ bán khi có đơn thuốc hợp lệ từ bác sĩ.</li>
            <li>Không sử dụng dịch vụ để mua bán lại, gian lận, hoặc vi phạm pháp luật.</li>
            <li>Không can thiệp, hack, hoặc cố gắng truy cập trái phép hệ thống.</li>
          </ul>
        ),
      },
      {
        id: 'tai-khoan',
        title: 'Tài khoản & bảo mật',
        body: (
          <p>
            Bạn chịu trách nhiệm bảo mật thông tin đăng nhập. Mọi hoạt động dưới tài khoản
            của bạn được coi là do bạn thực hiện. Thông báo ngay cho Long Châu nếu phát hiện
            truy cập trái phép.
          </p>
        ),
      },
      {
        id: 'noi-dung',
        title: 'Sở hữu trí tuệ',
        body: (
          <p>
            Mọi nội dung trên website (hình ảnh, văn bản, logo, mã nguồn) thuộc bản quyền của
            FPT Long Châu. Không sao chép, phân phối hoặc sử dụng cho mục đích thương mại
            khi chưa có sự cho phép bằng văn bản.
          </p>
        ),
      },
      {
        id: 'gioi-han',
        title: 'Giới hạn trách nhiệm',
        body: (
          <p>
            Long Châu cung cấp dịch vụ "như hiện tại" (as-is). Chúng tôi không chịu trách nhiệm
            về thiệt hại gián tiếp do sử dụng dịch vụ, bao gồm nhưng không giới hạn ở mất lợi
            nhuận, mất dữ liệu, hoặc gián đoạn kinh doanh.
          </p>
        ),
      },
      {
        id: 'thay-doi',
        title: 'Thay đổi điều khoản',
        body: (
          <p>
            Long Châu có thể cập nhật điều khoản này theo thời gian. Thay đổi quan trọng sẽ được
            thông báo qua email và banner trên website ít nhất 30 ngày trước khi có hiệu lực.
            Việc tiếp tục sử dụng dịch vụ sau ngày có hiệu lực đồng nghĩa với chấp nhận điều khoản mới.
          </p>
        ),
      },
      {
        id: 'luat-ap-dung',
        title: 'Luật áp dụng & giải quyết tranh chấp',
        body: (
          <p>
            Điều khoản này được điều chỉnh bởi pháp luật Việt Nam. Mọi tranh chấp phát sinh sẽ
            được giải quyết tại Tòa án nhân dân có thẩm quyền tại TP. Hồ Chí Minh. Hai bên
            ưu tiên thương lượng và hoà giải trước khi kiện tụng.
          </p>
        ),
      },
    ],
  },
];

export function getPolicyBySlug(slug: string): Policy | null {
  return POLICIES.find((p) => p.slug === slug) ?? null;
}
