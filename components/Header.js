import { Typography } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { UserContext } from '../pages/_app';
import Link, { NextLinkComposed } from '../src/Link';
import { getCookie } from '../src/utils';

export const Header = () => {
  const router = useRouter();
  const { currentUser, setCurrentUser } = useContext(UserContext);

  const logout = async () => {
    await axios({
      method: "post",
      url: `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/logout`,
      headers: {
        "X-CSRF-TOKEN": getCookie("csrf_access_token")
      },
      withCredentials: true
    });
    setCurrentUser({"userId": undefined});
    router.push("/");
  };

  return (
    <AppBar position="sticky">
      {currentUser.userId ? (
        <Toolbar>
          <Link
            variant="h5"
            underline="none"
            color="common.white"
            href="/"
            sx={{ flexGrow: 1 }}
          >
            Bookshare
          </Link>
          <Typography variant="body1">
            {`${currentUser.userId} さん`}
          </Typography>
          <Button
            variant="contained"
            component={NextLinkComposed}
            to={`/users/${currentUser.userId}`}
            color="info"
            sx={{ ml: 2 }}
          >
            マイページ
          </Button>
          <Button
            variant="contained"
            color="info"
            sx={{ ml: 2 }}
            onClick={logout}
          >
            ログアウト
          </Button>
        </Toolbar>
      ) : (
        <Toolbar>
          <Link
            variant="h5"
            underline="none"
            color="common.white"
            href="/"
            sx={{ flexGrow: 1 }}
          >
            Bookshare
          </Link>
          <Button
            variant="contained"
            component={NextLinkComposed}
            to="/login"
            color="info"
          >
            ログイン
          </Button>
        </Toolbar>
      )}
    </AppBar>
  );
};