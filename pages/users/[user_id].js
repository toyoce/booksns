import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import axios from 'axios';

const UserPage = ({ user }) => {
  const bookrecordRows = (
    <Box>
      {user.bookrecords.map((br) => (
        <Box key={br.isbn} sx={{ py: 2, display: "flex", borderBottom: 1, borderColor: "grey.400" }}>
          <Box sx={{ border: 1, borderColor: "grey.400" }}>
            <img src={br.img} width="80" />
          </Box>
          <Box sx={{ ml: 2 }}>
            <Typography variant="body2">{br.title}</Typography>
            <Box sx={{ mt: 1, display: "flex" }}>
              <Rating value={br.star} size="small" readOnly />
              <Typography variant="body2" sx={{ ml: 1, color: "grey.700" }}>
                {"(2022/10/11)"}
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ mt: 1 }}>{br.comment}</Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
  
  return (
    <Container>
      <Typography variant="h6" sx={{ my: 2 }}>
        {`${user.user_id} さんのページ`}
      </Typography>
      {bookrecordRows}
    </Container>
  );
};

export default UserPage;

export const getServerSideProps = async ({ params }) => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/users/${params.user_id}`,
    { params: { withRecords: 1 } }
  );
  const user = response.data;

  return { props: { user } };
};