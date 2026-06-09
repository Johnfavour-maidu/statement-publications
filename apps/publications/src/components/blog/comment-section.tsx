"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle, Reply, Send } from "lucide-react";
import { BlogComment, formatDate } from "@/lib/blog-data";

function CommentItem({ comment, depth = 0 }: { comment: BlogComment; depth?: number }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(comment.likes);
  const [showReply, setShowReply] = useState(false);

  return (
    <div className={`${depth > 0 ? "ml-10 sm:ml-12" : ""}`}>
      <div className="flex gap-3 sm:gap-4 py-5">
        <div className="relative w-9 h-9 rounded-full overflow-hidden shrink-0">
          <Image src={comment.avatar} alt={comment.author} fill className="object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-sm font-semibold text-charcoal">{comment.author}</span>
            <span className="text-[11px] text-dark-gray/40">{formatDate(comment.date)}</span>
          </div>
          <p className="text-sm text-dark-gray/70 leading-relaxed mb-3">{comment.content}</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => { setLiked(!liked); setLikeCount(liked ? likeCount - 1 : likeCount + 1); }}
              className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${liked ? "text-rose-500" : "text-dark-gray/40 hover:text-rose-500"}`}
            >
              <Heart className={`h-3.5 w-3.5 ${liked ? "fill-current" : ""}`} />{likeCount}
            </button>
            <button
              onClick={() => setShowReply(!showReply)}
              className="flex items-center gap-1.5 text-xs font-medium text-dark-gray/40 hover:text-[#8A6A4A] transition-colors"
            >
              <Reply className="h-3.5 w-3.5" />Reply
            </button>
          </div>
          <AnimatePresence>
            {showReply && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-3 overflow-hidden"
              >
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Write a reply..."
                    className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EBC9A8] focus:border-transparent"
                  />
                  <button className="px-3 py-2 bg-[#EBC9A8] text-charcoal rounded-lg text-xs font-semibold hover:bg-[#D8B27A] transition-colors">
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      {comment.replies?.map((reply) => (
        <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
      ))}
    </div>
  );
}

export default function CommentSection({ comments, postId }: { comments: BlogComment[]; postId: string }) {
  const [newComment, setNewComment] = useState("");
  const [allComments, setAllComments] = useState(comments);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const comment: BlogComment = {
      id: `new-${Date.now()}`,
      author: "You",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face",
      date: new Date().toISOString().split("T")[0],
      content: newComment,
      likes: 0,
    };
    setAllComments([comment, ...allComments]);
    setNewComment("");
  };

  return (
    <div className="mt-12 border-t border-gray-100 pt-8">
      <h3 className="text-xl font-bold text-charcoal mb-6" style={{ fontFamily: "var(--font-libre)" }}>
        Comments ({allComments.length})
      </h3>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex gap-3">
          <div className="relative w-9 h-9 rounded-full overflow-hidden shrink-0">
            <Image src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face" alt="You" fill className="object-cover" />
          </div>
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts..."
              rows={3}
              className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EBC9A8] focus:border-transparent resize-none"
            />
            <div className="flex justify-end mt-2">
              <button
                type="submit"
                disabled={!newComment.trim()}
                className="px-5 py-2 bg-[#EBC9A8] text-charcoal text-sm font-semibold rounded-lg hover:bg-[#D8B27A] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Post Comment
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Comments List */}
      <div className="divide-y divide-gray-50">
        {allComments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
}
