import React, { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Typography,
} from "@mui/material";
import { db } from "../../config";
import { collection, getDocs } from "firebase/firestore";

const Feedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchFeedbacks = async () => {
      try {
        const feedbackCollection = collection(db, "feedbacks");
        const feedbackSnapshot = await getDocs(feedbackCollection);
        const feedbackList = feedbackSnapshot.docs.map((doc) => doc.data());
        setFeedbacks(feedbackList);
        setTimeout(() => setLoading(false), 3000);
      } catch (error) {
        console.error("Error fetching feedbacks:", error);
      }
    };
    fetchFeedbacks();
  }, []);

  if (loading) {
    return <CircularProgress />;
  }
  const calSentiment = (sentiment) => {
    if(sentiment > 0.6) {
        return "Excellent"
    }
    else if(sentiment > -0.3){
        return "Average"
    }
    return "Bad"
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Feedbacks
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
          <TableRow sx={{backgroundColor:'#FAFAFA', fontSize: 14}}>
              <TableCell>Room Id</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Feedback</TableCell>
              <TableCell>Sentiment</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {feedbacks.map((feedback) => (
              <TableRow key={`${feedback.roomId}-${feedback.userId}`}>
                <TableCell>
                    {feedback.roomId}
                </TableCell>
                <TableCell>
                  {feedback?.userEmail || "N/A"}
                </TableCell>
                <TableCell>{feedback.message}</TableCell>
                <TableCell>{feedback.sentiment ? calSentiment(feedback.sentiment)  : "N/A"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default Feedbacks;
