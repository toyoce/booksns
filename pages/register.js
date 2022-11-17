import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';
import Link from '../src/Link';
import { UserContext } from './_app';

const RegisterPage = () => {
  const router = useRouter();
  const { setCurrentUser } = useContext(UserContext);

  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [processing, setProcessing] = useState(false);

  const handleUserIdChange = (event) => {
    setUserId(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleIconClick = () => {
    setShowPassword(!showPassword);
  };

  const register = async () => {
    if (!userId) {
      setErrorMessage("ユーザーIDを入力してください");
      return;
    }
    if (/[^\w\-]/.test(userId)) {
      setErrorMessage("ユーザーIDに使用できない文字が含まれています");
      return;
    }
    if (userId.length < 3) {
      setErrorMessage("ユーザーIDが短すぎます");
      return;
    }
    if (userId.length > 20) {
      setErrorMessage("ユーザーIDが長すぎます");
      return;
    }
    if (!password) {
      setErrorMessage("パスワードを入力してください");
      return;
    }
    if (/[^\w\-#\$%\?\+:;\*]/.test(password)) {
      setErrorMessage("パスワードに使用できない文字が含まれています");
      return;
    }
    if (password.length < 8) {
      setErrorMessage("パスワードが短すぎます");
      return;
    }
    if (password.length > 20) {
      setErrorMessage("パスワードが長すぎます");
      return;
    }
    setErrorMessage("");
    setProcessing(true);

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/register`,
        {
          user_id: userId,
          password
        },
        { withCredentials: true }
      );
      setCurrentUser({"userId": userId});
      router.push(`/users/${userId}`);
    } catch (error) {
      if (error.response && error.response.status == 409) {
        setErrorMessage("このユーザーIDは既に使われています");
      } else {
        setErrorMessage("エラーにより、アカウント作成に失敗しました");
      }
      setProcessing(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      register();
    }
  };

  return (
    <Container maxWidth="xs">
      <Typography variant="h6" sx={{ mt: 4 }}>
        Booksnsへようこそ
      </Typography>
      <Typography variant="subtitle2" sx={{ mt: 4 }}>
        ユーザーID
      </Typography>
      <TextField
        fullWidth
        size="small"
        helperText="3文字以上20文字以内の半角英数字または記号(-_)"
        value={userId}
        onChange={handleUserIdChange}
      />
      <Typography variant="subtitle2" sx={{ mt: 4 }}>
        パスワード
      </Typography>
      <TextField
        fullWidth
        size="small"
        helperText="8文字以上20文字以内の半角英数字または記号(-_#$%?+:;*)"
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
        onKeyDown={handleKeyDown}
      />
      <Button
        variant="contained"
        fullWidth
        sx={{ mt: 5 }}
        onClick={register}
        disabled={processing}
      >
        {processing ? "アカウントを作成中.." : "アカウントを作成"}
      </Button>
      <Typography
        variant="body2"
        sx={{ mt: 2, color: "error.light" }}
      >
        {errorMessage}
      </Typography>
      <Box sx={{ mt: 3 }}>
        <Link
          variant="body2"
          color="common.black"
          underline="hover"
          href="/login"
        >
          アカウントをお持ちの方はこちら
        </Link>
      </Box>
    </Container>
  );
};

export default RegisterPage;