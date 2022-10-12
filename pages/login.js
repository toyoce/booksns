import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useState } from 'react';

const LoginPage = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleUserIdChange = (event) => {
    setUserId(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleIconClick = () => {
    setShowPassword(!showPassword);
  };

  const login = () => {
    alert(`login as ${userId}`);
  };

  return (
    <Container maxWidth="xs">
      <Typography variant="h6" sx={{ mt: 4 }}>
        Bookshareへようこそ
      </Typography>
      <Typography variant="subtitle2" sx={{ mt: 4 }}>
        ユーザーID
      </Typography>
      <TextField
        fullWidth
        size="small"
        value={userId}
        onChange={handleUserIdChange}
      />
      <Typography variant="subtitle2" sx={{ mt: 4 }}>
        パスワード
      </Typography>
      <TextField
        fullWidth
        size="small"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleIconClick}>
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={handlePasswordChange}
      />
      <Button
        variant="contained"
        fullWidth
        sx={{ mt: 5 }}
        onClick={login}
      >
        ログイン
      </Button>
    </Container>
  );
};

export default LoginPage;