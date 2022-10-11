import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import Link from '../../src/Link';

const BookPage = ({ book }) => {
  const bookrecordRows = (
    <Box>
      {book.bookrecords.map((br) => (
        <Box key={br.user_id} sx={{ py: 2, borderBottom: 1, borderColor: "grey.400" }}>
          <Box sx={{ display: "flex" }}>
            <Link
              variant="body2"
              underline="hover"
              color="text.primary"
              href={`/users/${br.user_id}`}
            >
              {br.user_id}
            </Link>
            <Typography variant="body2" sx={{ ml: 1, color: "grey.700" }}>{"(2022/10/11)"}</Typography>
          </Box>
          <Box sx={{ mt: 1 }}>
            <Rating value={br.star} size="small" readOnly />
          </Box>
          <Typography variant="body2">{br.comment}</Typography>
        </Box>
      ))}
    </Box>
  );

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
      <Typography variant="subtitle1" sx={{ mt: 4 }}>レビュー一覧</Typography>
      {bookrecordRows}
    </Container>
  );
};

export default BookPage;

export const getServerSideProps = async ({ params }) => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/books/${params.isbn}`,
    { params: { withRecords: 1 } }
  );
  const book = response.data;

  return { props: { book } };
};