
import React from "react";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface AddCommentFormProps {
  commentText: string;
  setCommentText: (text: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const AddCommentForm: React.FC<AddCommentFormProps> = ({
  commentText,
  setCommentText,
  onSubmit,
}) => {
  return (
    <form onSubmit={onSubmit}>
      <div className="mb-2">
        <label htmlFor="comment" className="text-xs font-medium">
          Add Comment
        </label>
        <Textarea
          id="comment"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Enter your comment here..."
          className="mt-1 text-xs min-h-[60px] py-1"
        />
      </div>
      
      <div className="flex justify-end gap-2">
        <Button type="submit" variant="outline" size="sm" className="h-7 text-xs">
          <MessageSquare className="h-3 w-3 mr-1" />
          Add Comment
        </Button>
      </div>
    </form>
  );
};

export default AddCommentForm;
