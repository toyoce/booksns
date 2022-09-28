import SearchIcon from '@mui/icons-material/Search';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useState } from 'react';

export default function Home() {
  const [title, setTitle] = useState('');

  const handleTextChange = (event) => {
    setTitle(event.target.value);
  };

  return (
    <>
      <AppBar position="sticky">
        <Toolbar>
          <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
            Bookshare
          </Typography>
          <Button variant="contained" color="info" onClick={() => alert("login")}>ログイン</Button>
        </Toolbar>
      </AppBar>
      <Container>
        <TextField
          fullWidth
          placeholder="気になる本のタイトルを入力してください"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ mt: 3 }}
          variant="outlined"
          value={title}
          onChange={handleTextChange}
        />
        <Box mt={2} display="flex" alignItems="center">
          <Typography variant="h6">評価が高い本</Typography>
          <Typography variant="body2" ml={1}>もっと見る &gt;</Typography>
        </Box>
      </Container>
    </>
  );
}
