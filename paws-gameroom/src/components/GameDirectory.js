import React, { useState } from 'react';
import './GameDirectory.css';
import GameModal from './GameModal';

function GameDirectory() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedGame, setSelectedGame] = useState(null);

  const games = {
    ps5: {
      name: 'PlayStation 5',
      icon: '🎮',
      games: [
        {
          id: 'ps5-1',
          title: 'Spider-Man: Miles Morales',
          genre: 'Action/Adventure',
          players: '1 Player',
          rating: 'T (Teen)',
          playtime: '7-15 hours',
          description: 'Experience the rise of Miles Morales as the new hero masters incredible, explosive new powers to become his own Spider-Man.',
          image: 'https://image.api.playstation.com/vulcan/ap/rnd/202008/1420/HcLcfeQBXd2RiQaCeWQDCIFN.jpg',
          rules: 'https://www.ign.com/wikis/spider-man-miles-morales/Walkthrough'
        },
        {
          id: 'ps5-2',
          title: 'God of War Ragnarök',
          genre: 'Action/Adventure',
          players: '1 Player',
          rating: 'M (Mature)',
          playtime: '20-40 hours',
          description: 'Embark on an epic and heartfelt journey as Kratos and Atreus struggle with holding on and letting go.',
          image: 'https://image.api.playstation.com/vulcan/ap/rnd/202207/1210/4xJ8XB3bi888QTLZYdl7Oi0s.jpg',
          rules: 'https://www.ign.com/wikis/god-of-war-ragnarok/Walkthrough'
        },
        {
          id: 'ps5-3',
          title: 'Horizon Forbidden West',
          genre: 'Action RPG',
          players: '1 Player',
          rating: 'T (Teen)',
          playtime: '30-60 hours',
          description: 'Explore distant lands, fight bigger and more awe-inspiring machines, and encounter astonishing new tribes.',
          image: 'https://image.api.playstation.com/vulcan/ap/rnd/202107/3100/HO8vkO9pfXhwbHi5WHECQJdN.jpg',
          rules: 'https://www.ign.com/wikis/horizon-2-forbidden-west/Walkthrough'
        },
        {
          id: 'ps5-4',
          title: 'Gran Turismo 7',
          genre: 'Racing',
          players: '1-2 Players (Online: 20)',
          rating: 'E (Everyone)',
          playtime: '25+ hours',
          description: 'The ultimate driving experience. From classic cars to modern race cars, drive them all.',
          image: 'https://image.api.playstation.com/vulcan/ap/rnd/202109/1321/yZ7dpmjtHr1olhutHT3IebHi.jpg',
          rules: 'https://www.ign.com/wikis/gran-turismo-7/Guide'
        },
        {
          id: 'ps5-5',
          title: 'Demon\'s Souls',
          genre: 'Action RPG',
          players: '1 Player (Online Co-op)',
          rating: 'M (Mature)',
          playtime: '30-40 hours',
          description: 'Experience the original brutal challenge, completely remade from the ground up.',
          image: 'https://image.api.playstation.com/vulcan/ap/rnd/202011/1717/GemRaOZaCMhGxQ9dRhnQQyT5.jpg',
          rules: 'https://www.ign.com/wikis/demons-souls/Walkthrough'
        },
        {
          id: 'ps5-6',
          title: 'Ratchet & Clank: Rift Apart',
          genre: 'Action/Platform',
          players: '1 Player',
          rating: 'E10+ (Everyone 10+)',
          playtime: '10-15 hours',
          description: 'Blast through an interdimensional adventure with Ratchet and Clank.',
          image: 'https://image.api.playstation.com/vulcan/ap/rnd/202101/2921/HMoV4L5tsFBXnqMtHCLYNqt6.jpg',
          rules: 'https://www.ign.com/wikis/ratchet-and-clank-rift-apart/Walkthrough'
        }
      ]
    },
    xbox: {
      name: 'Xbox Series X',
      icon: '🎯',
      games: [
        {
          id: 'xbox-1',
          title: 'Halo Infinite',
          genre: 'First-Person Shooter',
          players: '1-4 Players (Online: 24)',
          rating: 'T (Teen)',
          playtime: '10-15 hours',
          description: 'When all hope is lost and humanity\'s fate hangs in the balance, the Master Chief is ready to confront the most ruthless foe he\'s ever faced.',
          image: 'https://store-images.s-microsoft.com/image/apps.21536.13727851868390641.c9cc5f66-aff8-406c-af6b-440838730be0.68796bde-cbf5-4eaa-a299-011417041da6',
          rules: 'https://www.ign.com/wikis/halo-infinite/Walkthrough'
        },
        {
          id: 'xbox-2',
          title: 'Forza Horizon 5',
          genre: 'Racing',
          players: '1 Player (Online: 72)',
          rating: 'E (Everyone)',
          playtime: '20+ hours',
          description: 'Your Ultimate Horizon Adventure awaits! Explore vibrant and ever-evolving open world landscapes of Mexico.',
          image: 'https://store-images.s-microsoft.com/image/apps.34293.13806711081356008.a0c5eb39-b6a1-44cd-832f-f66bf5f6f13e.e1078f23-c460-4173-96f8-f3f6c8a0e2f5',
          rules: 'https://www.ign.com/wikis/forza-horizon-5/Guide'
        },
        {
          id: 'xbox-3',
          title: 'Gears 5',
          genre: 'Third-Person Shooter',
          players: '1-3 Players (Online: 10)',
          rating: 'M (Mature)',
          playtime: '12-15 hours',
          description: 'From one of gaming\'s most acclaimed sagas, Gears 5 relaunches with brand new features.',
          image: 'https://store-images.s-microsoft.com/image/apps.12150.13551831136678364.e7df8acc-1bf6-4e42-b66f-e008da75e3e0.72b2f38f-03ab-4b4e-8df6-6e1e893a61a5',
          rules: 'https://www.ign.com/wikis/gears-5/Walkthrough'
        },
        {
          id: 'xbox-4',
          title: 'Microsoft Flight Simulator',
          genre: 'Simulation',
          players: '1 Player',
          rating: 'E (Everyone)',
          playtime: 'Unlimited',
          description: 'From light planes to wide-body jets, fly highly detailed and accurate aircraft.',
          image: 'https://store-images.s-microsoft.com/image/apps.50930.13588911772080584.a27eca73-3c13-48a9-8c2f-7f5075373dc5.db0e1dc6-5aa0-412c-bc35-0a7bb970b079',
          rules: 'https://www.ign.com/wikis/microsoft-flight-simulator/Guide'
        },
        {
          id: 'xbox-5',
          title: 'Sea of Thieves',
          genre: 'Adventure',
          players: '1-4 Players',
          rating: 'T (Teen)',
          playtime: 'Unlimited',
          description: 'A pirate\'s life for you! Sea of Thieves is the ultimate pirate adventure.',
          image: 'https://store-images.s-microsoft.com/image/apps.16347.13554021958116579.6e019c7e-393a-42d5-b537-eca547f7797f.37027278-1277-4e80-ac65-7f0ab1bbead7',
          rules: 'https://www.ign.com/wikis/sea-of-thieves/Guide'
        },
        {
          id: 'xbox-6',
          title: 'Ori and the Will of the Wisps',
          genre: 'Platform/Adventure',
          players: '1 Player',
          rating: 'E (Everyone)',
          playtime: '12-15 hours',
          description: 'Embark on an adventure through a beautiful and immersive world.',
          image: 'https://store-images.s-microsoft.com/image/apps.10280.14506879174547499.9f27db48-7dc2-410d-8f4e-2f6f5c5c9f12.d95f01f0-3e48-4a95-8fc0-5fb94f11c043',
          rules: 'https://www.ign.com/wikis/ori-and-the-will-of-the-wisps/Walkthrough'
        }
      ]
    },
    switch: {
      name: 'Nintendo Switch',
      icon: '🍄',
      games: [
        {
          id: 'switch-1',
          title: 'The Legend of Zelda: Breath of the Wild',
          genre: 'Action/Adventure',
          players: '1 Player',
          rating: 'E10+ (Everyone 10+)',
          playtime: '50+ hours',
          description: 'Explore the wilds of Hyrule any way you like in this stunning open-world adventure.',
          image: 'https://assets.nintendo.com/image/upload/c_fill,w_1200/q_auto:best/f_auto/dpr_2.0/ncom/software/switch/70010000000025/7137262b5a64d921e193653f8aa0b722925abc5680380ca0e18a5cfd91697f58',
          rules: 'https://www.ign.com/wikis/the-legend-of-zelda-breath-of-the-wild/Walkthrough'
        },
        {
          id: 'switch-2',
          title: 'Mario Kart 8 Deluxe',
          genre: 'Racing',
          players: '1-4 Players (Online: 12)',
          rating: 'E (Everyone)',
          playtime: 'Unlimited',
          description: 'Hit the road with the definitive version of Mario Kart 8 and play anywhere.',
          image: 'https://assets.nintendo.com/image/upload/c_fill,w_1200/q_auto:best/f_auto/dpr_2.0/ncom/software/switch/70010000000308/7137262b5a64d921e193653f8aa0b722925abc5680380ca0e18a5cfd91697f58',
          rules: 'https://www.ign.com/wikis/mario-kart-8-deluxe/Guide'
        },
        {
          id: 'switch-3',
          title: 'Super Smash Bros. Ultimate',
          genre: 'Fighting',
          players: '1-8 Players',
          rating: 'E10+ (Everyone 10+)',
          playtime: 'Unlimited',
          description: 'Everyone is here! The biggest Super Smash Bros. game ever with every fighter from the series.',
          image: 'https://assets.nintendo.com/image/upload/c_fill,w_1200/q_auto:best/f_auto/dpr_2.0/ncom/software/switch/70010000012332/ac4d1fc9824876ce756406f0525d50c57ded4b2a666f6dfe40a6ac5c3563fad9',
          rules: 'https://www.ign.com/wikis/super-smash-bros-ultimate/Guide'
        },
        {
          id: 'switch-4',
          title: 'Animal Crossing: New Horizons',
          genre: 'Life Simulation',
          players: '1-4 Players (Online: 8)',
          rating: 'E (Everyone)',
          playtime: 'Unlimited',
          description: 'Escape to a deserted island and create your own paradise.',
          image: 'https://assets.nintendo.com/image/upload/c_fill,w_1200/q_auto:best/f_auto/dpr_2.0/ncom/software/switch/70010000027619/9989957eae3a6b545194c42fec2071675c34aadacd65e6b33fdfe7b3b6a86c3a',
          rules: 'https://www.ign.com/wikis/animal-crossing-new-horizons/Guide'
        },
        {
          id: 'switch-5',
          title: 'Super Mario Odyssey',
          genre: 'Platform',
          players: '1-2 Players',
          rating: 'E10+ (Everyone 10+)',
          playtime: '12-60 hours',
          description: 'Join Mario on a massive, globe-trotting 3D adventure.',
          image: 'https://assets.nintendo.com/image/upload/c_fill,w_1200/q_auto:best/f_auto/dpr_2.0/ncom/software/switch/70010000001130/c42553b4fd0312c31e70ec7468c6c9bccd739f340152925b9600631f2d29f8b5',
          rules: 'https://www.ign.com/wikis/super-mario-odyssey/Walkthrough'
        },
        {
          id: 'switch-6',
          title: 'Splatoon 3',
          genre: 'Shooter',
          players: '1-8 Players',
          rating: 'E10+ (Everyone 10+)',
          playtime: '10+ hours',
          description: 'Enter the Splatlands, a sun-scorched desert inhabited by battle-hardened Inklings and Octolings.',
          image: 'https://assets.nintendo.com/image/upload/c_fill,w_1200/q_auto:best/f_auto/dpr_2.0/ncom/software/switch/70010000046510/a24e959b03b72b105e65e6eb87bd456798aad4e637bc2b227897aa7ab30cf43f',
          rules: 'https://www.ign.com/wikis/splatoon-3/Guide'
        }
      ]
    },
    boardgames: {
      name: 'Board Games',
      icon: '🎲',
      games: [
        {
          id: 'board-1',
          title: 'Settlers of Catan',
          genre: 'Strategy',
          players: '3-4 Players',
          rating: '10+',
          playtime: '60-90 minutes',
          description: 'Build settlements, cities, and roads on the island of Catan as you trade resources and compete for victory.',
          image: 'https://m.media-amazon.com/images/I/81+okm4IpfL._AC_SL1500_.jpg',
          rules: 'https://www.catan.com/sites/default/files/2021-06/catan_5th_ed_rules_200707.pdf'
        },
        {
          id: 'board-2',
          title: 'Ticket to Ride',
          genre: 'Strategy',
          players: '2-5 Players',
          rating: '8+',
          playtime: '30-60 minutes',
          description: 'Collect cards of various types of train cars and claim railway routes connecting cities throughout North America.',
          image: 'https://m.media-amazon.com/images/I/91YNJM4oyhL._AC_SL1500_.jpg',
          rules: 'https://ncdn0.daysofwonder.com/tickettoride/en/img/tt_rules_2015_en.pdf'
        },
        {
          id: 'board-3',
          title: 'Monopoly',
          genre: 'Economic',
          players: '2-8 Players',
          rating: '8+',
          playtime: '60-180 minutes',
          description: 'Buy, sell, and scheme your way to riches in the classic property trading game.',
          image: 'https://m.media-amazon.com/images/I/91RSg9MCGtL._AC_SL1500_.jpg',
          rules: 'https://www.hasbro.com/common/instruct/00009.pdf'
        },
        {
          id: 'board-4',
          title: 'Pandemic',
          genre: 'Cooperative Strategy',
          players: '2-4 Players',
          rating: '8+',
          playtime: '45 minutes',
          description: 'Work together as a team to treat infections around the world while gathering resources for cures.',
          image: 'https://m.media-amazon.com/images/I/71CVlZKm9BL._AC_SL1024_.jpg',
          rules: 'https://images.zmangames.com/filer_public/99/89/99890eea-4a77-4bfb-88d6-e077e1f6a5d7/zm7101_pandemic_rules.pdf'
        },
        {
          id: 'board-5',
          title: 'Scrabble',
          genre: 'Word Game',
          players: '2-4 Players',
          rating: '10+',
          playtime: '90 minutes',
          description: 'Form words on the board using letter tiles and score points based on letter values.',
          image: 'https://m.media-amazon.com/images/I/81Bvv1nKPJL._AC_SL1500_.jpg',
          rules: 'https://scrabble.hasbro.com/en-us/rules'
        },
        {
          id: 'board-6',
          title: 'Risk',
          genre: 'Strategy/War',
          players: '2-6 Players',
          rating: '10+',
          playtime: '120+ minutes',
          description: 'Conquer territories and continents in this classic game of global domination.',
          image: 'https://m.media-amazon.com/images/I/91gZ6moCdaL._AC_SL1500_.jpg',
          rules: 'https://www.hasbro.com/common/instruct/risk.pdf'
        },
        {
          id: 'board-7',
          title: 'Clue',
          genre: 'Mystery/Deduction',
          players: '3-6 Players',
          rating: '8+',
          playtime: '45 minutes',
          description: 'Solve the mystery of who committed the murder, where, and with what weapon.',
          image: 'https://m.media-amazon.com/images/I/91R6tODpufL._AC_SL1500_.jpg',
          rules: 'https://www.hasbro.com/common/instruct/Clue_2002.PDF'
        },
        {
          id: 'board-8',
          title: 'Codenames',
          genre: 'Word/Party',
          players: '4-8 Players',
          rating: '14+',
          playtime: '15-30 minutes',
          description: 'Two rival spymasters give one-word clues to help their teams guess words on the board.',
          image: 'https://m.media-amazon.com/images/I/71ZHkM7fHwL._AC_SL1024_.jpg',
          rules: 'https://czechgames.com/files/rules/codenames-rules-en.pdf'
        },
        {
          id: 'board-9',
          title: 'Chess',
          genre: 'Strategy',
          players: '2 Players',
          rating: '6+',
          playtime: '30-60 minutes',
          description: 'The classic game of strategic warfare between two armies.',
          image: 'https://m.media-amazon.com/images/I/71I1XJ7HWIL._AC_SL1500_.jpg',
          rules: 'https://www.chess.com/learn-how-to-play-chess'
        },
        {
          id: 'board-10',
          title: 'Checkers',
          genre: 'Strategy',
          players: '2 Players',
          rating: '6+',
          playtime: '30 minutes',
          description: 'Jump over opponent pieces to capture them and reach the other side to become a king.',
          image: 'https://m.media-amazon.com/images/I/91CwTjRcmPL._AC_SL1500_.jpg',
          rules: 'https://www.officialgamerules.org/checkers'
        },
        {
          id: 'board-11',
          title: 'Uno',
          genre: 'Card Game',
          players: '2-10 Players',
          rating: '7+',
          playtime: '30 minutes',
          description: 'Match colors and numbers to be the first to get rid of all your cards.',
          image: 'https://m.media-amazon.com/images/I/818a9hHEsqL._AC_SL1500_.jpg',
          rules: 'https://www.ultraboardgames.com/uno/game-rules.php'
        },
        {
          id: 'board-12',
          title: 'Jenga',
          genre: 'Dexterity',
          players: '1+ Players',
          rating: '6+',
          playtime: '20 minutes',
          description: 'Remove blocks from the tower and place them on top without toppling the structure.',
          image: 'https://m.media-amazon.com/images/I/71+8uulbmvL._AC_SL1500_.jpg',
          rules: 'https://www.jenga.com/about.php'
        }
      ]
    }
  };

  const getFilteredGames = () => {
    if (selectedCategory === 'all') {
      return games;
    }
    return { [selectedCategory]: games[selectedCategory] };
  };

  const handleGameClick = (game) => {
    setSelectedGame(game);
  };

  const closeModal = () => {
    setSelectedGame(null);
  };

  return (
    <div className="game-directory">
      <h1>Game Directory</h1>
      <p className="directory-subtitle">Browse our collection of video games and board games</p>

      <div className="filter-buttons">
        <button 
          className={selectedCategory === 'all' ? 'active' : ''}
          onClick={() => setSelectedCategory('all')}
        >
          All Games
        </button>
        <button 
          className={selectedCategory === 'ps5' ? 'active' : ''}
          onClick={() => setSelectedCategory('ps5')}
        >
          🎮 PlayStation 5
        </button>
        <button 
          className={selectedCategory === 'xbox' ? 'active' : ''}
          onClick={() => setSelectedCategory('xbox')}
        >
          🎯 Xbox Series X
        </button>
        <button 
          className={selectedCategory === 'switch' ? 'active' : ''}
          onClick={() => setSelectedCategory('switch')}
        >
          🍄 Nintendo Switch
        </button>
        <button 
          className={selectedCategory === 'boardgames' ? 'active' : ''}
          onClick={() => setSelectedCategory('boardgames')}
        >
          🎲 Board Games
        </button>
      </div>

      <div className="games-sections">
        {Object.entries(getFilteredGames()).map(([key, category]) => (
          <section key={key} className="games-category">
            <h2>
              <span className="category-icon">{category.icon}</span>
              {category.name}
            </h2>
            <div className="games-grid">
              {category.games.map(game => (
                <div 
                  key={game.id} 
                  className="game-tile"
                  onClick={() => handleGameClick(game)}
                >
                  <div className="game-image-container">
                    <img 
                      src={game.image} 
                      alt={game.title}
                      onError={(e) => {
                        e.target.src = `https://via.placeholder.com/300x400/667eea/ffffff?text=${encodeURIComponent(game.title)}`;
                      }}
                    />
                    <div className="game-overlay">
                      <h3>{game.title}</h3>
                      <p>{game.genre}</p>
                      <span className="click-info">Click for details</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <GameModal game={selectedGame} onClose={closeModal} />
    </div>
  );
}

export default GameDirectory;