import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { useContext } from 'react';
import Link, { NextLinkComposed } from '../../src/Link';
import { UserContext } from '../_app';

const UserPage = ({ user }) => {
  const { currentUser } = useContext(UserContext);

  const bookrecordRows = (
    <Box>
      {user.bookrecords.map((br) => (
        <Box key={br.isbn} sx={{ py: 2, display: "flex", borderBottom: 1, borderColor: "grey.400" }}>
          <Box sx={{ border: 1, borderColor: "grey.400" }}>
            <img src={br.img} width="80" />
          </Box>
          <Box sx={{ ml: 2 }}>
            <Link
              variant="body2"
              color="text.primary"
              underline="hover"
              href={`/books/${br.isbn}`}
            >
              {br.title}
            </Link>
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
      <Box sx={{ mt: 3, mb: 1, display: "flex", alignItems: "center" }}>
        <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
          レビュー一覧
        </Typography>
        {currentUser.userId === user.user_id && (
          <Button
            variant="contained"
            component={NextLinkComposed}
            to={"/books"}
            color="info"
            size="small"
          >
            レビューを追加
          </Button>
        )}
      </Box>
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