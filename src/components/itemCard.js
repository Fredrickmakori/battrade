import React, { useState } from "react";
import { Card, Button, Form } from "react-bootstrap";

const ItemCard = ({ item, onLike }) => {
  const [comment, setComment] = useState("");

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    //Add comment to firebase here
    setComment("");
  };

  return (
    <Card style={{ width: "18rem" }}>
      {/* ... existing Card content ... */}
      <div>
        <span onClick={() => onLike(item.id)}>
          ❤️ {item.likes?.length || 0}
        </span>
        {/*Show number of likes and use onClick for like functionality*/}
      </div>
      <div>
        <Form onSubmit={handleCommentSubmit}>
          <Form.Group>
            <Form.Control
              type="text"
              placeholder="Add a comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </Form.Group>
          <Button type="submit">Comment</Button>
        </Form>

        {/* Display existing comments here */}
        {item.comments?.map((comment) => (
          <p key={comment.timestamp}>
            {comment.commentText} - {comment.authorUid}
          </p>
        ))}
      </div>
    </Card>
  );
};

export default ItemCard;
