import React, { useEffect, useRef } from 'react';
import { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { Flip } from './Flip';
import { Form, Button } from 'react-bootstrap'
import { useForm } from 'react-hook-form';

const FlashcardWithForm = React.forwardRef((props, forwardedRef) => {
  const { register, handleSubmit, reset } = useForm();
  let [flipped, setFlipped] = useState(false);

  let cardRef = useRef();
  forwardedRef = useRef();

  useEffect(() => {
    forwardedRef.current = cardRef.current;
  }, []);

  function keyDownFrontHandler(e) {
    if (e.key === 'Enter') {
      setFlipped(true);
      cardRef.current.querySelector('.flashcard-back textarea').select();
      e.preventDefault();
    }
  }

  function keyDownBackHandler(e) {
    if (e.key === 'Enter') {
      handleSubmit(onSubmit)();
      e.preventDefault();
    }
  }

  function onSubmit(data) {
    props.onSubmit(data);

    reset();
    setFlipped(false);
    // cardRef.current.querySelector('.flashcard-front textarea').select();
  }

  return <Form>
    <Flip flipped={flipped} height="200" ref={cardRef} front={() => (
      <div className="flashcard-front d-flex flex-column justify-content-around">
        <Form.Control autoFocus onFocus={(e) => e.target.select()}
          defaultValue={props.front || ''} {...register('front', { required: true })} 
          as="textarea" placeholder="Front..." className="flex-fill mb-2" 
                      style={{resize: 'none'}} onKeyDown={keyDownFrontHandler}/>

        <Button variant="outline-secondary" onClick={() => setFlipped(true)}>
          Back <i className="bi bi-arrow-right"></i>
        </Button>
      </div>
    )} back={() => (
      <div className="flashcard-back d-flex flex-column justify-content-around">
        <Form.Control defaultValue={props.back || ''} {...register('back', { required: true, defaultValue: props.back || ''})} 
          as="textarea" placeholder="Back..." className="flex-fill mb-2"
                      style={{resize: 'none'}} onKeyDown={keyDownBackHandler} />
        <Row>
          <Col sm="6">
            <Button className="d-block w-100" variant="outline-secondary" onClick={() => setFlipped(false)}>
              <i className="bi bi-arrow-left"></i> Front
            </Button>
          </Col>
          <Col sm="6">
            <Button onClick={handleSubmit(onSubmit)} className="d-block w-100" variant="success">
              { props.buttonText || 'Button' }
            </Button>
          </Col>
        </Row>
      </div>
    )} />
  </Form>
});

export {
  FlashcardWithForm
}