import React from "react";
import Modal from "material-ui/Modal";
import Button from "material-ui/Button";
import Typography from "material-ui/Typography";
import Card, { CardActions, CardContent, CardMedia } from "material-ui/Card";

const getModalStyle = () => {
  const top = 20;
  const left = 0;

  return {
    top: `${top}%`,
    left: `${left}%`
  };
};

const PromotionModal = props => {
  const { open, classMedia, classCard, handleClose, handleAddClick } = props;

  return (
    <Modal
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      open={open}
      onClose={handleClose}
    >
      <Card style={getModalStyle()} className={classCard}>
        <CardMedia className={classMedia} image="/serval.jpg" title="Serval" />
        <CardContent>
          <Typography gutterBottom variant="headline" component="h2">
            A2HSテスト
          </Typography>
          <Typography component="p">
            ホーム画面追加するととてもいいことあるよ！
          </Typography>
        </CardContent>
        <CardActions>
          <Button onClick={handleClose} size="small" color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddClick} size="small" color="primary">
            Add to homescreen!
          </Button>
        </CardActions>
      </Card>
    </Modal>
  );
};

export default PromotionModal;
