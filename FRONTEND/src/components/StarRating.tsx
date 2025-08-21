import React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating?: number; // optional now
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating = 0,
  maxRating = 5,
  size = "md",
  interactive = false,
  onRatingChange,
}) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  const handleStarClick = (starIndex: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(starIndex + 1);
    }
  };

  const safeRating = typeof rating === "number" ? rating : 0;

  return (
    <div className="flex items-center gap-1">
      {[...Array(maxRating)].map((_, index) => {
        const isFilled = index < Math.floor(safeRating);
        const isHalfFilled =
          index < safeRating && index >= Math.floor(safeRating);

        return (
          <div key={index} className="relative">
            <Star
              className={cn(
                sizeClasses[size],
                "transition-colors duration-200",
                interactive && "cursor-pointer hover:text-warning",
                isFilled ? "fill-warning text-warning" : "text-muted-foreground"
              )}
              onClick={() => handleStarClick(index)}
            />
            {isHalfFilled && (
              <Star
                className={cn(
                  sizeClasses[size],
                  "absolute top-0 left-0 fill-warning text-warning transition-colors duration-200",
                  "clip-path-half"
                )}
                style={{ clipPath: "inset(0 50% 0 0)" }}
              />
            )}
          </div>
        );
      })}
      <span className="ml-2 text-sm text-muted-foreground">
        {safeRating.toFixed(1)}
      </span>
    </div>
  );
};
