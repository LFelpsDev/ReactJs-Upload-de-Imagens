import { Button, Box } from '@chakra-ui/react';
import React, { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';

import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

interface Image {
  title: string;
  description: string;
  url: string;
  ts: number;
  id: string;
}

interface GetImagesData {
  after: string;
  data: Image[];
}

export default function Home(): JSX.Element {
  async function reqForImages({ pageParam = null }): Promise<GetImagesData> {
    const { data } = await api.get('/api/images', {
      params: {
        after: pageParam,
      },
    })
    console.log(data)
    return data;
  }


  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    'images', reqForImages, {
    getNextPageParam: lastPage => lastPage?.after,
  }
  );

  const formattedData = useMemo(() => {
    const formatted = data?.pages.flatMap(xImage => {
      return xImage.data.flat()
    })
    return formatted;
  }, [data]);

  if (isLoading && !isError) {
    return <Loading />
  }

  if (!isLoading && isError) {
    return <Error />
  }

  return (
    <>
      <Header />

      <Box maxW={1120} px={20} mx="auto" my={20}>
        <CardList cards={formattedData} />

        {hasNextPage && (
          <Button 
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            mt="6"
          >
            {isFetchingNextPage ? 'Carregando...' : 'Carregar mais'}
          </Button>
        )}

      </Box>
    </>
  );
}
