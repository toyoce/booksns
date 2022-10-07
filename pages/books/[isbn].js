import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import axios from 'axios';

const BookPage = ({ book }) => {
  return (
    <Container>
      <Box sx={{ mt: 2, display: "flex" }}>
        <Box sx={{ border: 1, borderColor: "grey.400" }}>
          <img src={book.img} />
        </Box>
        <Box sx={{ ml: 3 }}>
          <Typography variant="h6">{book.title}</Typography>
          <Typography variant="body2">{book.author}</Typography>
          <Box sx={{ mt: 1, display: "flex" }}>
            <Rating value={Math.round(book.star*2)/2} precision={0.5} readOnly />
            <Typography variant="body1" sx={{ ml: 1 }}>
              {`${Math.round(book.star*10)/10} (${book.reviewCount})`}
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ mt: 1 }}>{book.description}</Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default BookPage;

export const getServerSideProps = async ({ params }) => {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/books/${params.isbn}`);
  const book = response.data;

  return { props: { book } };
};