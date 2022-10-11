import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import axios from 'axios';

const UserPage = ({ bookrecords }) => {
  const bookrecordRows = (
    <Box>
      {bookrecords.map((br) => (
        <Box key={br.isbn} sx={{ py: 2, borderBottom: 1, borderColor: "grey.400" }}>
          <Typography variant="body2">{br.title}</Typography>
        </Box>
      ))}
    </Box>
  );
  
  return (
    <Container>
      {bookrecordRows}
    </Container>
  );
};

export default UserPage;

export const getServerSideProps = async ({ params }) => {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/bookrecords/${params.user_id}`);
  const bookrecords = response.data.bookrecords;

  return { props: { bookrecords } };
};