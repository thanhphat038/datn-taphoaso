// src/service/Comment.service.js

import Cookies from "js-cookie";

export async function getProductComments(productId) {
  const res = await fetch(`/api/comments/product/${productId}/all-comments`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token') || Cookies.get("auth_token")}`,
    },
  });
  return res.json();
}

export async function postComment(productId, comment) {
  const res = await fetch('/api/comments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token') || Cookies.get("auth_token")}`,
    },
    body: JSON.stringify({ product_id: productId, comment }),
  });
  if (!res.ok) throw new Error('Gửi bình luận thất bại');
  return res.json();
} 