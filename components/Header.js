import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

export const Header = () => {
  return (
    <AppBar position="sticky">
      <Toolbar>
        <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
          Bookshare
        </Typography>
        <Button variant="contained" color="info" onClick={() => alert("login")}>ログイン</Button>
      </Toolbar>
    </AppBar>
  );
};