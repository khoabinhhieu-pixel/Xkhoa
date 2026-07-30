type ReviewItem = {
  id: string;
  rating: number;
  comment: string;
  createdAt: Date;
  user: { fullName: string };
};

export default function ReviewList({ reviews }: { reviews: ReviewItem[] }) {
  if (reviews.length === 0) {
    return (
      <p className="text-sm text-fg-muted">
        Chưa có đánh giá nào cho sản phẩm này.
      </p>
    );
  }

  return (
    <ul className="flex flex-col divide-y divide-border">
      {reviews.map((review) => (
        <li key={review.id} className="py-5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-fg">{review.user.fullName}</p>
            <span
              className="shrink-0 text-xs text-fg"
              aria-label={`${review.rating} trên 5 sao`}
            >
              {"★".repeat(review.rating)}
              <span className="text-border-strong">
                {"★".repeat(5 - review.rating)}
              </span>
            </span>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-fg-muted">
            {review.comment}
          </p>
          <p className="mt-2 text-xs text-fg-muted">
            {new Date(review.createdAt).toLocaleDateString("vi-VN")}
          </p>
        </li>
      ))}
    </ul>
  );
}
