import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Clock, Users } from "lucide-react";

interface RecipeCardProps {
  id: string;
  title: string;
  image: string;
  cookTime: string;
  serves: string;
  description?: string;
}

const RecipeCard = ({ id, title, image, cookTime, serves, description }: RecipeCardProps) => {
  return (
    <Link to={`/recipe/${id}`}>
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-[var(--hover-shadow)] cursor-pointer group">
        <div className="aspect-[4/3] overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="p-4 md:p-5">
          <h3 className="font-semibold text-lg md:text-xl mb-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          {description && (
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {description}
            </p>
          )}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{cookTime}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{serves}</span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default RecipeCard;
