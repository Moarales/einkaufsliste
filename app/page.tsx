"use client"
"use strict"
import ListItem from "./ListItem";
import { Box, TextField } from '@mui/material';
import { useCallback, useEffect, useState } from "react";


const retrieveItems = async () => {
  const url = "http://192.168.178.100:3001/items";
  console.log("retrieving items")
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    console.log(json);
    return json as ListItem[];

  } catch (error: any) {
    throw new Error(`Response status: ${error}`);
  }
}



export default function Home() {
  const [author, setAuthor] = useState("Alle")
  const [listItems, SetListItems] = useState<ListItem[]>([])

  const generateListItems = useCallback((items: ListItem[]) => {
    return items.map(item => {
      return <ListItem key={item.item_id} item_id={item.item_id} item={item.item} author={item.author} onItemDelete={handleItemDeletion}></ListItem>
    })

  }, []);


  const handleItemDeletion=()=>{
    retrieveItems().then(retrievedItems => SetListItems(retrievedItems));
  }

  useEffect(() => {
    console.log("useEffet in page.tsx")
    retrieveItems().then(retrievedItems => SetListItems(retrievedItems));
  }, []);


  return (
    <Box m={2} >
      <div className="mx-auto flex  flex-col text-xl gap-4">
        <h1>Einkaufsliste der Loft</h1>
        <TextField sx={{ input: { color: 'white' } }} id="filled-basic" label="Author" variant="outlined" value={author} onChange={(e) => {
          setAuthor(e.target.value);
        }} />
        <div className="flex flex-col text-m gap-5">
          {generateListItems(listItems)}
        </div>
      </div>
    </Box>
  );
}

