import React from 'react';
import { useSession } from 'next-auth/react';
import { MessageSquare, Reply, ThumbsUp, Trash } from 'lucide-react';
import { Language } from '@/types';

interface Comment {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
  };
  createdAt: string;
  replies: Comment[];
  likes: number;
}

interface CommentsProps {
  buildingId: string;
  language: Language;
}

const Comments: React.FC<CommentsProps> = ({ buildingId, language }) => {
  const { data: session } = useSession();
  const [comments, setComments] = React.useState<Comment[]>([]);
  const [newComment, setNewComment] = React.useState('');
  const [replyingTo, setReplyingTo] = React.useState<string | null>(null);

  const translations = {
    en: {
      comments: "Comments",
      writeComment: "Write a comment...",
      reply: "Reply",
      delete: "Delete",
      post: "Post",
      loginToComment: "Login to comment",
      ago: "ago"
    },
    ku: {
      comments: "بۆچوونەکان",
      writeComment: "بۆچوونێک بنووسە...",
      reply: "وەڵامدانەوە",
      delete: "سڕینەوە",
      post: "ناردن",
      loginToComment: "داخل بە بۆ نووسینی بۆچوون",
      ago: "لەمەوبەر"
    }
  };

  const formatDate = (date: string) => {
    const now = new Date();
    const commentDate = new Date(date);
    const diffInMinutes = Math.floor((now.getTime() - commentDate.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ${translations[language].ago}`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ${translations[language].ago}`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ${translations[language].ago}`;
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    // Implementation for submitting comment
  };

  const handleDeleteComment = async (commentId: string) => {
    // Implementation for deleting comment
  };

  const handleLikeComment = async (commentId: string) => {
    // Implementation for liking comment
  };

  const CommentComponent: React.FC<{ comment: Comment; level?: number }> = ({ comment, level = 0 }) => (
    <div className={`${level > 0 ? 'ml-8' : ''} mb-4`}>
      <div className="border-2 border-black p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="font-mono font-bold">{comment.author.name}</div>
          <div className="text-sm font-mono">{formatDate(comment.createdAt)}</div>
        </div>
        
        <p className="font-mono mb-4">{comment.content}</p>
        
        <div className="flex gap-4">
          <button
            onClick={() => handleLikeComment(comment.id)}
            className="flex items-center gap-1 hover:text-gray-600"
          >
            <ThumbsUp size={16} />
            {comment.likes}
          </button>
          
          <button
            onClick={() => setReplyingTo(comment.id)}
            className="flex items-center gap-1 hover:text-gray-600"
          >
            <Reply size={16} />
            {translations[language].reply}
          </button>
          
          {session?.user?.email === comment.author.email && (
            <button
              onClick={() => handleDeleteComment(comment.id)}
              className="flex items-center gap-1 hover:text-gray-600"
            >
              <Trash size={16} />
              {translations[language].delete}
            </button>
          )}
        </div>

        {replyingTo === comment.id && (
          <form onSubmit={handleSubmitComment} className="mt-4">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full border-2 border-black p-2 font-mono"
              placeholder={translations[language].writeComment}
            />
            <div className="flex justify-end mt-2">
              <button
                type="submit"
                className="bg-black text-white px-4 py-2 font-mono hover:bg-white hover:text-black border-2 border-black transition-colors"
              >
                {translations[language].post}
              </button>
            </div>
          </form>
        )}
      </div>

      {comment.replies.map((reply) => (
        <CommentComponent key={reply.id} comment={reply} level={level + 1} />
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-mono flex items-center gap-2">
        <MessageSquare size={24} />
        {translations[language].comments}
      </h3>

      {session ? (
        <form onSubmit={handleSubmitComment} className="mb-8">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full border-4 border-black p-4 font-mono"
            placeholder={translations[language].writeComment}
            rows={3}
          />
          <div className="flex justify-end mt-2">
            <button
              type="submit"
              className="bg-black text-white px-6 py-3 font-mono hover:bg-white hover:text-black border-2 border-black transition-colors"
            >
              {translations[language].post}
            </button>
          </div>
        </form>
      ) : (
        <div className="text-center py-8 border-4 border-black">
          <p className="font-mono">{translations[language].loginToComment}</p>
        </div>
      )}

      <div className="space-y-4">
        {comments.map((comment) => (
          <CommentComponent key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
};

export default Comments;