import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MapPin, Mail } from "lucide-react";
import { StarRating } from "./StarRating";
import type { Store } from "@/pages/UserDashboard";

interface StoreCardProps {
  store: Store;
  userRating?: number | null;
  onRateStore?: (rating: number) => void;
  showOwnerActions?: boolean;
}

export const StoreCard: React.FC<StoreCardProps> = ({
  store,
  userRating,
  onRateStore,
  showOwnerActions = false,
}) => {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold text-foreground">
              {store.name}
            </h3>
            <div className="flex items-center gap-2 mt-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span className="text-sm">{store.address}</span>
            </div>
            <div className="flex items-center gap-2 mt-1 text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span className="text-sm">{store.email}</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">
                Overall Rating:
              </span>
              <span className="text-sm text-muted-foreground">
                ({store.totalRatings} reviews)
              </span>
            </div>
            <StarRating rating={store.averageRating} />
          </div>

          {onRateStore && (
            <div>
              <span className="text-sm font-medium text-muted-foreground block mb-2">
                {userRating ? "Your Rating:" : "Rate this store:"}
              </span>
              <StarRating
                rating={userRating || 0}
                interactive={true}
                onRatingChange={onRateStore}
              />
              {userRating ? (
                <p className="text-xs text-muted-foreground mt-1">
                  Click stars to update your rating
                </p>
              ) : null}
            </div>
          )}

          {showOwnerActions ? (
            <div className="text-xs text-muted-foreground">
              {/* owner actions placeholder */}
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
};
