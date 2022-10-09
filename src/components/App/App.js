import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Main from '../Main'
import Expenses from '../Expenses'
import Invoices from '../Invoices'
import Invoice from '../Invoice'
import PageNotFound from '../PageNotFound'

export const App = () => {
  return (
    <>
      <h3>Grocery Hawker</h3>
      <BrowserRouter>
          <Routes>
            <Route path="/" element={<Main />}>
              <Route path="expenses" element={<Expenses />} />
              <Route path="invoices" element={<Invoices />} >
                <Route
                  index
                  element={
                    <main style={{ padding: "1rem" }}>
                      <p>Select an invoice</p>
                    </main>
                  }
                />
                <Route path=":invoiceId" element={<Invoice/>} />
              </Route>
              <Route path="*" element={<PageNotFound/>}/>
            </Route>
          </Routes>
        </BrowserRouter>
    </>
  )
}