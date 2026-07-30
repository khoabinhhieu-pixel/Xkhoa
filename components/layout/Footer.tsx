import Link from "next/link";

const COLUMNS = [
  {
    title: "Cửa hàng",
    links: ["Mới về", "Nữ", "Nam", "Phụ kiện", "Sale"],
  },
  {
    title: "Công ty",
    links: ["Về Fashion Shop", "Bền vững", "Tuyển dụng", "Báo chí"],
  },
  {
    title: "Hỗ trợ",
    links: ["Liên hệ", "Vận chuyển & đổi trả", "Hướng dẫn chọn size", "Câu hỏi thường gặp"],
  },
];

const BADGES = ["VISA", "MASTERCARD", "MOMO", "COD"];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-bg">
      <div className="mx-auto max-w-(--container-page) px-5 py-16 md:px-10 md:py-20">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
          <div className="col-span-2 md:col-span-2">
            <span className="tracked-label text-base font-semibold">
              Fashion Shop
            </span>
            <p className="mt-4 max-w-[26ch] text-sm leading-relaxed text-fg-muted">
              Thiết kế tối giản. Chất liệu bền. May đo cho cuộc sống hiện đại.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="tracked-label text-[11px] text-fg-muted">
                {col.title}
              </h4>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <Link
                      href="#"
                      className="text-sm text-fg/80 transition-colors hover:text-fg"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col gap-6 border-t border-border pt-8 md:flex-row md:items-center md:justify-between">
          <p className="tracked-label text-[10px] text-fg-muted">
            © 2026 Fashion Shop. All rights reserved.
          </p>
          <div className="tracked-label flex flex-wrap gap-x-6 gap-y-2 text-[10px] text-fg-muted">
            <Link href="#" className="hover:text-fg">
              Điều khoản
            </Link>
            <Link href="#" className="hover:text-fg">
              Bảo mật
            </Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {BADGES.map((badge) => (
              <span
                key={badge}
                className="tracked-label rounded-sm border border-border px-2 py-1 text-[9px] text-fg-muted"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
