import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import Link, { NextLinkComposed } from '../src/Link';

export const Header = () => {
  return (
    <AppBar position="sticky">
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
    </AppBar>
  );
};