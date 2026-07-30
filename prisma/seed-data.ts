export type SeedProduct = {
  id: string;
  name: string;
  price: number;
  category: string;
  gender: "nam" | "nu" | "unisex";
  tone: number;
  colors: string[];
  description: string;
};

export const SEED_PRODUCTS: SeedProduct[] = [
  {
    id: "wool-overcoat",
    name: "Áo khoác dạ Wool Overcoat",
    price: 2450000,
    category: "Áo khoác",
    gender: "unisex",
    tone: 0,
    colors: ["#1a1a1a", "#4a4436", "#8a8578"],
    description:
      "Áo khoác dạ dáng dài, form suông tối giản, giữ ấm tốt cho mùa lạnh mà vẫn thanh lịch khi phối cùng trang phục công sở hay dạo phố.",
  },
  {
    id: "silk-shirt",
    name: "Sơ mi lụa Silk Shirt",
    price: 980000,
    category: "Sơ mi",
    gender: "nu",
    tone: 3,
    colors: ["#c9c2b3", "#1a1a1a"],
    description:
      "Chất liệu lụa mềm mại, bề mặt óng nhẹ, form regular fit dễ phối, phù hợp cả đi làm lẫn dạo phố cuối tuần.",
  },
  {
    id: "tailored-trousers",
    name: "Quần tây ống suông Tailored Trousers",
    price: 1190000,
    category: "Quần",
    gender: "nam",
    tone: 1,
    colors: ["#3a3f47", "#1a1a1a", "#5c4a3a"],
    description:
      "Quần tây ống suông may đo tinh gọn, chất vải co giãn nhẹ, giữ form chuẩn cả ngày dài.",
  },
  {
    id: "merino-turtleneck",
    name: "Áo len cổ lọ Merino Turtleneck",
    price: 1050000,
    category: "Áo len",
    gender: "unisex",
    tone: 4,
    colors: ["#5c4a3a", "#8a8578", "#1a1a1a"],
    description:
      "Áo len cổ lọ dệt từ sợi merino mềm mịn, giữ ấm hiệu quả mà không gây bí, phù hợp mặc đơn hoặc layer bên trong áo khoác.",
  },
  {
    id: "denim-jacket",
    name: "Áo khoác denim Classic Denim Jacket",
    price: 1350000,
    category: "Áo khoác",
    gender: "unisex",
    tone: 2,
    colors: ["#3a3f47", "#8a8578"],
    description:
      "Áo khoác denim form regular kinh điển, chất vải bền màu, dễ phối với mọi phong cách từ basic đến năng động.",
  },
  {
    id: "pleated-skirt",
    name: "Chân váy xếp ly Pleated Midi Skirt",
    price: 890000,
    category: "Váy",
    gender: "nu",
    tone: 5,
    colors: ["#1a1a1a", "#c9c2b3"],
    description:
      "Chân váy xếp ly dài midi, form xoè nhẹ tạo chuyển động mềm mại khi di chuyển, phù hợp cả đi làm và dạo phố.",
  },
  {
    id: "cotton-tee",
    name: "Áo thun cotton Essential Tee",
    price: 450000,
    category: "Áo thun",
    gender: "unisex",
    tone: 3,
    colors: ["#1a1a1a", "#c9c2b3", "#8a8578"],
    description:
      "Áo thun cotton 100% form basic, chất vải dày dặn không xù lông, món đồ nền tảng cho mọi tủ đồ tối giản.",
  },
  {
    id: "linen-blazer",
    name: "Blazer vải lanh Linen Blazer",
    price: 1890000,
    category: "Blazer",
    gender: "nam",
    tone: 1,
    colors: ["#4a4436", "#1a1a1a"],
    description:
      "Blazer vải lanh thoáng mát, form vai tự nhiên không độn, thích hợp mặc trong những ngày oi nóng mà vẫn giữ vẻ chỉn chu.",
  },
  {
    id: "chino-shorts",
    name: "Quần short kaki Chino Shorts",
    price: 690000,
    category: "Quần",
    gender: "nam",
    tone: 5,
    colors: ["#8a8578", "#4a4436", "#1a1a1a"],
    description:
      "Quần short kaki form regular, chất vải chino bền đẹp, độ dài vừa phải phù hợp mùa hè.",
  },
  {
    id: "classic-polo",
    name: "Áo polo cotton Classic Polo",
    price: 590000,
    category: "Áo thun",
    gender: "nam",
    tone: 2,
    colors: ["#1a1a1a", "#3a3f47", "#c9c2b3"],
    description:
      "Áo polo cotton piqué form vừa vặn, cổ bẻ gọn gàng, lựa chọn an toàn cho phong cách smart-casual.",
  },
  {
    id: "bomber-jacket",
    name: "Áo khoác bomber Bomber Jacket",
    price: 1590000,
    category: "Áo khoác",
    gender: "nam",
    tone: 0,
    colors: ["#1a1a1a", "#3a3f47"],
    description:
      "Áo khoác bomber form regular, gấu và cổ tay bo chun, giữ ấm tốt cho những ngày chuyển mùa.",
  },
  {
    id: "oxford-shirt",
    name: "Sơ mi Oxford Button-down",
    price: 750000,
    category: "Sơ mi",
    gender: "nam",
    tone: 4,
    colors: ["#c9c2b3", "#3a3f47", "#1a1a1a"],
    description:
      "Sơ mi vải Oxford cổ button-down kinh điển, chất vải dày dặn bền form, phù hợp cả môi trường công sở lẫn phong cách casual.",
  },
  {
    id: "wrap-dress",
    name: "Đầm suông Midi Wrap Dress",
    price: 1290000,
    category: "Đầm",
    gender: "nu",
    tone: 2,
    colors: ["#5c4a3a", "#1a1a1a"],
    description:
      "Đầm wrap dáng midi, thiết kế buộc eo tôn dáng nhẹ nhàng, chất vải rũ mềm phù hợp nhiều dịp.",
  },
  {
    id: "knit-cardigan",
    name: "Áo cardigan len Knit Cardigan",
    price: 990000,
    category: "Áo len",
    gender: "nu",
    tone: 0,
    colors: ["#8a8578", "#c9c2b3", "#1a1a1a"],
    description:
      "Áo cardigan len dệt kim mềm mại, form vừa vặn, dễ khoác ngoài áo thun hoặc sơ mi trong ngày se lạnh.",
  },
  {
    id: "wide-leg-trousers",
    name: "Quần ống rộng Wide-leg Trousers",
    price: 1090000,
    category: "Quần",
    gender: "nu",
    tone: 4,
    colors: ["#1a1a1a", "#4a4436"],
    description:
      "Quần ống rộng lưng cao, form suông thẳng tạo hiệu ứng chân dài, chất vải rũ đẹp khi di chuyển.",
  },
  {
    id: "silk-blouse",
    name: "Áo blouse lụa Silk Blouse",
    price: 890000,
    category: "Sơ mi",
    gender: "nu",
    tone: 5,
    colors: ["#c9c2b3", "#5c4a3a", "#1a1a1a"],
    description:
      "Áo blouse lụa form rộng rãi thoải mái, tay áo dáng suông nhẹ, phù hợp phong cách thanh lịch tối giản.",
  },
];

export type SeedTestimonial = {
  authorName: string;
  authorRole: string;
  quote: string;
  rating: number;
  avatarTone: number;
  displayOrder: number;
};

export const SEED_TESTIMONIALS: SeedTestimonial[] = [
  {
    authorName: "Minh Anh",
    authorRole: "Khách hàng tại Hà Nội",
    quote:
      "Chất liệu vượt mong đợi so với mức giá. Áo khoác dạ mặc qua một mùa đông vẫn giữ form rất tốt.",
    rating: 5,
    avatarTone: 0,
    displayOrder: 0,
  },
  {
    authorName: "Gia Bảo",
    authorRole: "Khách hàng tại TP. Hồ Chí Minh",
    quote:
      "Giao diện đặt hàng dễ dùng, thiết kế tối giản đúng gu mình thích. Sẽ tiếp tục ủng hộ shop.",
    rating: 5,
    avatarTone: 1,
    displayOrder: 1,
  },
  {
    authorName: "Thuỳ Linh",
    authorRole: "Khách hàng tại Đà Nẵng",
    quote:
      "Đóng gói cẩn thận, giao hàng nhanh. Chất vải sơ mi lụa mềm mịn hơn mình nghĩ.",
    rating: 4,
    avatarTone: 3,
    displayOrder: 2,
  },
  {
    authorName: "Đức Huy",
    authorRole: "Khách hàng tại Hà Nội",
    quote:
      "Mình thích cách phối màu trung tính của các sản phẩm, dễ mix đồ đi làm.",
    rating: 5,
    avatarTone: 2,
    displayOrder: 3,
  },
  {
    authorName: "Ngọc Trâm",
    authorRole: "Khách hàng tại Cần Thơ",
    quote:
      "Chính sách đổi trả rõ ràng, tư vấn size nhiệt tình qua tin nhắn.",
    rating: 5,
    avatarTone: 5,
    displayOrder: 4,
  },
];
