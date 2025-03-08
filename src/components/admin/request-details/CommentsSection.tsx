
import React from "react";
import { format } from "date-fns";
import { type Comment } from "@/services";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CommentsSectionProps {
  comments: Comment[];
}

const CommentsSection: React.FC<CommentsSectionProps> = ({ comments }) => {
  if (!comments || comments.length === 0) return null;
  
  return (
    <div className="mt-2">
      <h4 className="text-xs font-medium mb-1">Comments</h4>
      <ScrollArea className="h-[80px] rounded-md border p-2">
        {comments.map((comment: Comment) => (
          <div key={comment.id} className="mb-2 pb-2 border-b last:border-0">
            <div className="flex justify-between">
              <span className="text-xs font-medium">{comment.user_name}</span>
              <span className="text-[10px] text-muted-foreground">
                {format(new Date(comment.created_at), "PPp")}
              </span>
            </div>
            <p className="text-xs mt-1">{comment.text}</p>
          </div>
        ))}
      </ScrollArea>
    </div>
  );
};

export default CommentsSection;
