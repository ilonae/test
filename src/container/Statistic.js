import React from 'react';
import PropTypes from 'prop-types';

import { Grid, Typography, makeStyles, Container, Button, ButtonGroup } from '@material-ui/core';


const useStyles = makeStyles(() => ({
    image: () => ({
        border: '1px solid #555',
        verticalAlign: 'middle',
        width: '100%',
        height: '100%',
        display: 'block',
        filter: 'blur(0)',
        imageRendering: 'crisp-edges',
        transform: 'translateZ(0)',
    }),
    typography: {
        wordWrap: 'break-word',
        height: '10%',
        fontWeight: 'bold',

        display: 'flex',
        flexDirection: 'column',
    },
    centering: {
        textAlign: 'center',
        maxHeight: '100%'
    },
    height: {
        height: '80%',
        width: '80%',
        display: 'grid',
        gridTemplate: 'repeat(3, 1fr) / repeat(3, 1fr)',
        margin: '0 auto'
    },

    test: {
        padding: '10px',
        overflow: 'hidden',
        minWidth: '0'
    },
    box: {
        marginTop: '2em',
        textAlign: 'center',
    },
    flex: {
        display: 'grid',
        width: '80%',
        margin: '0 auto',
        gridTemplateColumns: '40fr 60fr',
        gap: '10px',
        padding: '2em',
        paddingBottom: '0'
    }
}));

const StatisticBox = ({
    statistic,
    name,
    relevance,
    images,
    amount
}) => {
    const classes = useStyles();
    const [imgState, setImages] = React.useState([]);
    const [filterWidth, setFilterWidth] = React.useState(null);


    React.useEffect(() => {
        const makeImages = async () => {
            const statisticsImages = [];
            for (let i = 0; i < images.length; i++) {
                const img = `data:image/png;base64,${images[i]}`;
                statisticsImages.push(
                    <Container xs={6} className={classes.test} key={`${name}_image_index${i}`}>
                        <img src={img} className={classes.image} name={'image'} alt="" />
                    </Container>
                );
            }
            setImages(statisticsImages);
        };
        if (images) {
            makeImages();
        }

    }, [images, classes.image, name]);

    const statisticWidth = amount === 2
        ? 6
        : amount === 4
            ? 6
            : 4;



    const statistics = <div name={'statistic'} className={classes.box}>
        <div className={classes.flex}>

            <Typography variant="subtitle1" gutterBottom className={classes.typography}>
                Class name:
            </Typography>
            <Typography variant="subtitle1" gutterBottom >
                {name}
            </Typography>

            <Typography variant="subtitle1" gutterBottom className={classes.typography} >
                {statistic}:
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
                {relevance}
            </Typography>
        </div>
        <div className={classes.height}  >

            {imgState}

        </div> </div>;

    return (
        <Grid item xl={statisticWidth} lg={statisticWidth} md={12} sm={12}>
            {statistics}


        </Grid>
    );
};
StatisticBox.propTypes = {
    name: PropTypes.string,
    images: PropTypes.array,
    amount: PropTypes.number
};

export default StatisticBox;
