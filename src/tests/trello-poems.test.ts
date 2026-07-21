import { describe, expect, it } from 'vitest'

import { mapBoardToPoems } from '../../api/trello-poems'

describe('Trello board poems', () => {
  it('maps each described card to one poem and preserves board order', () => {
    expect(mapBoardToPoems({
      name: 'Poemas',
      cards: [
        { id: 'card-1', name: 'Primeiro verso', desc: 'Corpo do primeiro poema.' },
        { id: 'empty-card', name: 'Rascunho', desc: '' },
        { id: 'card-2', name: 'Segundo verso', desc: 'Corpo do segundo poema.' },
      ],
    })).toEqual([
      { id: 'card-1', title: 'Primeiro verso', body: 'Corpo do primeiro poema.' },
      { id: 'card-2', title: 'Segundo verso', body: 'Corpo do segundo poema.' },
    ])
  })
})
