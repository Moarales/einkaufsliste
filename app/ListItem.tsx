'use client'
import styles from './ListItem.module.css'
import { useState } from "react";


export type ListItem = {
    item_id: number,
    item: string,
    author: string
    onItemDelete: ()=>void
}



const deleteItem = async (id:number, onItemDelete: ()=>void) => {
    const url = `http://192.168.178.100:3001/items/${id}` ;
    try {
      const response = await fetch(url, {
        method: 'DELETE',
      });
      onItemDelete();
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
        console.log("sucessfully deleted Item")
    } catch (error: any) {
      throw new Error(`Response status: ${error}`);
    }
  }

export function ListItem({ item_id, item, author, onItemDelete }:
    ListItem) {

    const [crossed, setCrossed] = useState(false)

    const handleClick = () => setCrossed(!crossed);

    const handleRemoval = () => {
        deleteItem(item_id,onItemDelete);
    }

    return (
        <div>
            <button className={styles.button} onClick={handleClick}>
                <p style={{ textDecoration: crossed ? "line-through" : "none" }}>
                    {item}
                </p>
            </button>
            <button onClick={handleRemoval}>
                <img src="/trashIcon.png" alt="Trash Icon" width="32" height="32" />
            </button>
        </div>
    );
}

export default ListItem
