import { Grid, Typography } from "@mui/material";
import wallpaperLogin from '../../assets/wallpaperLogin8.png'

export const AuthLayout = ({children, title = ''}) => {

    return (
        <Grid 
            alignItems="center"
            container
            spacing={0}
            direction="column"
            justifyContent="center"
            sx={{
                minHeight: '100vh',                
                backgroundImage: `url(${wallpaperLogin})`,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                backgroundAttachment: 'fixed',
                padding: 0,
            }}
        >
            <Grid
                className="box-shadow"
                size={{xs: 5, sm: 4, md: 6}}
                sx={{width: {sm: 450}, backgroundColor: 'white', padding: 2, borderRadius: 2}}  
            >
                <Typography variant="h5" sx={{mb: 0, borderRadius: 2, textAlign: 'center'}}>
                    {title}
                </Typography>
                {children}
            </Grid>
        </Grid>
    );
};
