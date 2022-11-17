import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Typography } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';
import { UserContext } from '../pages/_app';
import Link, { NextLinkComposed } from '../src/Link';
import { getCookie } from '../src/utils';

export const Header = () => {
  const router = useRouter();
  const { currentUser, setCurrentUser } = useContext(UserContext);

  const [anchorEl, setAnchorEl] = useState(null);

  const handleIconClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMypageClick = () => {
    router.push(`/users/${currentUser.userId}`);
    setAnchorEl(null);
  };

  const handleLogoutClick = () => {
    logout();
    setAnchorEl(null);
  };

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
            Booksns
          </Link>
          <Typography variant="body1">
            {`${currentUser.userId} さん`}
          </Typography>
          <IconButton sx={{ ml: 2 }} onClick={handleIconClick}>
            <AccountCircleIcon fontSize="large" />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
          >
            <MenuItem onClick={handleMypageClick}>マイページ</MenuItem>
            <MenuItem onClick={handleLogoutClick}>ログアウト</MenuItem>
          </Menu>
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
            Booksns
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