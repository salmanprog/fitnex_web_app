import React,{useEffect, useState} from 'react'
import ContentWrapper from '../../../components/shared/contentWrapper';
import { useParams } from 'react-router-dom';
import { useFetch } from "../../../hooks/request";
import HttpRequest from "../../../repositories";
import api from "../../../repositories/api";


const ContentPage = () => {
  return (
      <section className="main-content d-flex ">
        <div className='row'>
          <div className="col-sm-12">
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
          
          </div>
        </div>
      </section>
     

  )
}

export default React.memo(ContentPage);