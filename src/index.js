document.addEventListener('DOMContentLoaded', () => {
    const quoteList = document.getElementById('quote-list');
    const newQuoteForm = document.getElementById('new-quote-form');
    const newQuoteInput = document.getElementById('new-quote');
    const authorInput = document.getElementById('author');
  
       function fetchAndRenderQuotes() {
      fetch('http://localhost:3000/quotes?_embed=likes')
        .then(response => response.json())
        .then(quotes => {
          quoteList.innerHTML = '';
          quotes.forEach(renderQuote);
        });
    }
  
        function renderQuote(quote) {
      const li = document.createElement('li');
      li.className = 'quote-card';
      li.innerHTML = `
        <blockquote class="blockquote">
          <p class="mb-0">${quote.text}</p>
          <footer class="blockquote-footer">${quote.author}</footer>
          <br>
          <button class='btn-success'>Likes: <span>${quote.likes.length}</span></button>
          <button class='btn-danger'>Delete</button>
          <button class='btn-edit'>Edit</button>
          <form class='edit-form' style='display: none;'>
            <input type='text' value='${quote.text}' class='edit-text form-control'>
            <input type='text' value='${quote.author}' class='edit-author form-control'>
            <button type='submit' class='btn btn-secondary'>Save</button>
          </form>
        </blockquote>
      `;
  
    
      const likeButton = li.querySelector('.btn-success');
      likeButton.addEventListener('click', () => {
        fetch('http://localhost:3000/likes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ quoteId: quote.id, createdAt: Math.floor(Date.now() / 1000) })
        })
        .then(response => response.json())
        .then(() => {
          const likeCount = likeButton.querySelector('span');
          likeCount.textContent = parseInt(likeCount.textContent) + 1;
        });
      });
  
     
      const deleteButton = li.querySelector('.btn-danger');
      deleteButton.addEventListener('click', () => {
        fetch(`http://localhost:3000/quotes/${quote.id}`, {
          method: 'DELETE'
        })
        .then(() => li.remove());
      });
  
    
      const editButton = li.querySelector('.btn-edit');
      const editForm = li.querySelector('.edit-form');
  
      editButton.addEventListener('click', () => {
        editForm.style.display = 'block';
      });
  
      editForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const editedText = editForm.querySelector('.edit-text').value;
        const editedAuthor = editForm.querySelector('.edit-author').value;
  
        fetch(`http://localhost:3000/quotes/${quote.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ text: editedText, author: editedAuthor })
        })
        .then(response => response.json())
        .then(updatedQuote => {
          li.querySelector('.mb-0').textContent = updatedQuote.text;
          li.querySelector('.blockquote-footer').textContent = updatedQuote.author;
          editForm.style.display = 'none';
        });
      });
  
      quoteList.appendChild(li);
    }
  
   
    newQuoteForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const newQuote = {
        text: newQuoteInput.value,
        author: authorInput.value
      };
  
      fetch('http://localhost:3000/quotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newQuote)
      })
      .then(response => response.json())
      .then(quote => {
        quote.likes = [];
        renderQuote(quote);
        newQuoteForm.reset();
      });
    });
  
  
    fetchAndRenderQuotes();
  });
  