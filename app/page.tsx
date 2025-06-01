"use client"
"use strict"
import ListItem from "./ListItem";
import { Box, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField } from '@mui/material';
import { useCallback, useEffect, useState } from "react";
import AddCircleIcon from '@mui/icons-material/AddCircle';



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
  const [newItem, SetNewItem] = useState("");


  const generateListItems = useCallback((items: ListItem[]) => {
    return items.map(item => {
      return <ListItem key={item.item_id} item_id={item.item_id} item={item.item} author={item.author} onItemDelete={reloadItemsFromServer}></ListItem>
    })

  }, []);


  const reloadItemsFromServer = () => {
    retrieveItems().then(retrievedItems => SetListItems(retrievedItems));
  }

  useEffect(() => {
    console.log("useEffet in page.tsx")
    retrieveItems().then(retrievedItems => SetListItems(retrievedItems));
  }, []);

  const handleAddItem = async (itemName: string, authorName: string) => {
    const url = `http://192.168.178.100:3001/item`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: new URLSearchParams({
          'item': itemName,
          'author': authorName,
        })
      });
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      reloadItemsFromServer();
      console.log("sucessfully added Item")
    } catch (error: any) {
      throw new Error(`Response status: ${error}`);
    }
  }


  return (
    <Box m={2} >
      <div className="mx-auto flex  flex-col text-xl gap-4">
        <h1>Einkaufsliste der Loft</h1>
        <TextField sx={{ input: { color: 'white' } }} id="filled-basic" label="Author" variant="outlined" value={author} onChange={(e) => {
          setAuthor(e.target.value);
        }} />
        <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password">ItemName</InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            type={'text'}
            color="primary"
            sx={{ input: { color: 'white' } }}
            value={newItem}
            onChange={(e) => {
              SetNewItem(e.target.value);
            }}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label={"add item"}
                  onClick={() => handleAddItem(newItem, author)}
                  edge="end"
                  color="primary"
                >
                  <AddCircleIcon />
                </IconButton>
              </InputAdornment>
            }
            label="ItemName"
          />
        </FormControl>
        <div className="flex flex-col text-m gap-5">
          {generateListItems(listItems)}
        </div>
      </div>
    </Box>
  );
}

